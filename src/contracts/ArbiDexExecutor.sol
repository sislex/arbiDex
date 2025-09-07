// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/* ───────────────  Minimal interfaces  ─────────────── */

interface IERC20 {
    function balanceOf(address) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function decimals() external view returns (uint8); // optional (not all tokens), used off-chain
}

interface IUniswapV2Router02 {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
}

interface ISwapRouterV3 {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24  fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96; // 0 for no limit
    }

    function exactInputSingle(ExactInputSingleParams calldata params)
    external
    payable
    returns (uint256 amountOut);
}

/* ───────────────  Utils  ─────────────── */

abstract contract ReentrancyGuard {
    uint256 private _locked;
    modifier nonReentrant() {
        require(_locked == 0, "REENTRANCY");
        _locked = 1;
        _;
        _locked = 0;
    }
}

abstract contract Ownable {
    address public owner;
    event OwnershipTransferred(address indexed prev, address indexed next);
    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }
    constructor() { owner = msg.sender; emit OwnershipTransferred(address(0), msg.sender); }
    function transferOwnership(address next) external onlyOwner {
        require(next != address(0), "ZERO_ADDR");
        emit OwnershipTransferred(owner, next);
        owner = next;
    }
}

/* ───────────────  Arbitrage executor  ─────────────── */

contract ArbiDexExecutor is Ownable, ReentrancyGuard {
    // Tokens (Arbitrum One native addresses по умолчанию, но можно задать любые при деплое)
    IERC20 public immutable USDC; // 6 decimals (0xaf88... e5831)
    IERC20 public immutable WETH; // 18 decimals (0x82aF... bAb1)

    // Routers
    IUniswapV2Router02 public immutable sushiV2;     // 0x1b02...7506
    ISwapRouterV3     public immutable uniV3Router; // 0x68b34658...65c45 (Uniswap V3 SwapRouter02)

    event ArbitrageExecuted(
        address indexed caller,
        uint256 amountInUSDC,
        uint256 minProfitUSDC,
        uint256 usdcSpent,
        uint256 usdcGained,
        int256  netProfitUSDC,   // signed, but ожидаем >= minProfit
        string  route            // "SUSHI->UNI" или "UNI->SUSHI"
    );

    constructor(
        address _USDC,
        address _WETH,
        address _sushiRouterV2,
        address _uniV3Router
    ) {
        require(_USDC != address(0) && _WETH != address(0), "ZERO_TOKEN");
        require(_sushiRouterV2 != address(0) && _uniV3Router != address(0), "ZERO_ROUTER");
        USDC = IERC20(_USDC);
        WETH = IERC20(_WETH);
        sushiV2 = IUniswapV2Router02(_sushiRouterV2);
        uniV3Router = ISwapRouterV3(_uniV3Router);
    }

    /* -----------------------------------------------------------
       Core idea:
       - Контракт "тянет" у msg.sender amountIn USDC (нужен approve на контракт).
       - Делает 2 свопа в одном tx.
       - Сравнивает конечный баланс USDC со стартовым + amountIn + minProfit.
       - Возвращает пользователю все USDC, которые пришли сверх исходного баланса.
       - Любой фэйл (minOut, deadline, minProfit) => revert.
       ----------------------------------------------------------- */

    /// @notice Покупаем WETH на Sushi (USDC->WETH), продаём WETH на Uni V3 (WETH->USDC).
    /// @param amountInUSDC   сколько USDC потратить (в минималках, 6 знаков)
    /// @param sushiPath      путь для V2, например [USDC, WETH]
    /// @param sushiMinOutWETH минимум WETH с первого свопа
    /// @param uniFee         500 / 3000 / 10000
    /// @param uniMinOutUSDC  минимум USDC со второго свопа
    /// @param deadline       now <= deadline
    /// @param minProfitUSDC  минимально приемлемая чистая прибыль в USDC (минималки)
    function executeSushiBuy_UniSell(
        uint256 amountInUSDC,
        address[] calldata sushiPath,
        uint256 sushiMinOutWETH,
        uint24  uniFee,
        uint256 uniMinOutUSDC,
        uint256 deadline,
        uint256 minProfitUSDC
    ) external nonReentrant onlyOwner {
        require(block.timestamp <= deadline, "EXPIRED");
        require(amountInUSDC > 0, "ZERO_IN");
        require(sushiPath.length >= 2 && sushiPath[0] == address(USDC) && sushiPath[sushiPath.length-1] == address(WETH), "BAD_PATH");
        require(uniFee == 500 || uniFee == 3000 || uniFee == 10000, "BAD_FEE");

        // фиксируем стартовый баланс USDC (контракт не должен "богатеть")
        uint256 usdcStart = USDC.balanceOf(address(this));

        // тянем у пользователя USDC под точную сумму
        require(USDC.transferFrom(msg.sender, address(this), amountInUSDC), "TRANSFER_FROM_FAIL");

        // approve под точную сумму на Sushi
        _approveIfNeeded(USDC, address(sushiV2), amountInUSDC);
        // своп 1: USDC -> WETH на Sushi (с minOut + deadline)
        sushiV2.swapExactTokensForTokens(
            amountInUSDC,
            sushiMinOutWETH,
            sushiPath,
            address(this),
            deadline
        );

        uint256 wethBal = WETH.balanceOf(address(this));
        require(wethBal >= sushiMinOutWETH, "LOW_WETH_OUT");

        // approve под точную сумму на Uni V3
        _approveIfNeeded(WETH, address(uniV3Router), wethBal);
        // своп 2: WETH -> USDC на Uni V3 (с minOut + deadline)
        ISwapRouterV3.ExactInputSingleParams memory p = ISwapRouterV3.ExactInputSingleParams({
            tokenIn: address(WETH),
            tokenOut: address(USDC),
            fee: uniFee,
            recipient: address(this),
            deadline: deadline,
            amountIn: wethBal,
            amountOutMinimum: uniMinOutUSDC,
            sqrtPriceLimitX96: 0
        });
        uniV3Router.exactInputSingle(p);

        // profit guard: конечный баланс должен покрывать тело сделки + minProfit
        uint256 usdcEnd = USDC.balanceOf(address(this));
        require(usdcEnd >= usdcStart + amountInUSDC + minProfitUSDC, "LOW_PROFIT");

        // отправляем пользователю всё, что пришло сверх стартового баланса
        uint256 payout = usdcEnd - usdcStart;
        require(USDC.transfer(msg.sender, payout), "USDC_TRANSFER_FAIL");

        // на всякий случай возвращаем возможные остатки WETH
        uint256 wethLeft = WETH.balanceOf(address(this));
        if (wethLeft > 0) {
            require(WETH.transfer(msg.sender, wethLeft), "WETH_TRANSFER_FAIL");
        }

        emit ArbitrageExecuted(msg.sender, amountInUSDC, minProfitUSDC, amountInUSDC, payout, int256(payout) - int256(amountInUSDC), "SUSHI->UNI");
    }

    /// @notice Покупаем WETH на Uni V3 (USDC->WETH), продаём WETH на Sushi V2 (WETH->USDC).
    function executeUniBuy_SushiSell(
        uint256 amountInUSDC,
        uint24  uniFee,
        uint256 uniMinOutWETH,
        address[] calldata sushiPath, // [WETH, USDC]
        uint256 sushiMinOutUSDC,
        uint256 deadline,
        uint256 minProfitUSDC
    ) external nonReentrant onlyOwner {
        require(block.timestamp <= deadline, "EXPIRED");
        require(amountInUSDC > 0, "ZERO_IN");
        require(sushiPath.length >= 2 && sushiPath[0] == address(WETH) && sushiPath[sushiPath.length-1] == address(USDC), "BAD_PATH");
        require(uniFee == 500 || uniFee == 3000 || uniFee == 10000, "BAD_FEE");

        uint256 usdcStart = USDC.balanceOf(address(this));

        require(USDC.transferFrom(msg.sender, address(this), amountInUSDC), "TRANSFER_FROM_FAIL");

        _approveIfNeeded(USDC, address(uniV3Router), amountInUSDC);
        // своп 1: USDC -> WETH на Uni V3
        ISwapRouterV3.ExactInputSingleParams memory p = ISwapRouterV3.ExactInputSingleParams({
            tokenIn: address(USDC),
            tokenOut: address(WETH),
            fee: uniFee,
            recipient: address(this),
            deadline: deadline,
            amountIn: amountInUSDC,
            amountOutMinimum: uniMinOutWETH,
            sqrtPriceLimitX96: 0
        });
        uniV3Router.exactInputSingle(p);

        uint256 wethBal = WETH.balanceOf(address(this));
        require(wethBal >= uniMinOutWETH, "LOW_WETH_OUT");

        _approveIfNeeded(WETH, address(sushiV2), wethBal);
        // своп 2: WETH -> USDC на Sushi V2
        sushiV2.swapExactTokensForTokens(
            wethBal,
            sushiMinOutUSDC,
            sushiPath,
            address(this),
            deadline
        );

        uint256 usdcEnd = USDC.balanceOf(address(this));
        require(usdcEnd >= usdcStart + amountInUSDC + minProfitUSDC, "LOW_PROFIT");

        uint256 payout = usdcEnd - usdcStart;
        require(USDC.transfer(msg.sender, payout), "USDC_TRANSFER_FAIL");

        uint256 wethLeft = WETH.balanceOf(address(this));
        if (wethLeft > 0) {
            require(WETH.transfer(msg.sender, wethLeft), "WETH_TRANSFER_FAIL");
        }

        emit ArbitrageExecuted(msg.sender, amountInUSDC, minProfitUSDC, amountInUSDC, payout, int256(payout) - int256(amountInUSDC), "UNI->SUSHI");
    }

    /* ─────────────── internal helpers ─────────────── */

    function _approveIfNeeded(IERC20 token, address spender, uint256 amount) internal {
        // ставим allowance под точную сумму; если текущее allowance < amount — обнуляем и выставляем amount
        uint256 cur = token.allowance(address(this), spender);
        if (cur < amount) {
            // некоторые токены требуют сначала обнулить allowance
            require(token.approve(spender, 0), "APPROVE_RESET_FAIL");
            require(token.approve(spender, amount), "APPROVE_FAIL");
        }
    }

    /* ─────────────── owner rescue (safety) ─────────────── */

    function rescueToken(address token, uint256 amount, address to) external onlyOwner {
        require(IERC20(token).transfer(to, amount), "RESCUE_FAIL");
    }
}
