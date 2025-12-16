export class TokenDto {
  tokenId: number;
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
}

export class CreateTokenDto {
  address: string;
  chainId: number;
}
