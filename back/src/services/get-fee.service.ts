import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class GetFeeService {
  private provider = new ethers.JsonRpcProvider(
      'https://arb-mainnet.g.alchemy.com/v2/TxHI6ptndQEJi3coISt0BcQZdZg1rnWV'
  );

  async getPoolFee(address: string) {
    const pool = new ethers.Contract(
      address,
      ['function fee() view returns (uint24)'],
      this.provider
    );

    try {
      const fee = await pool.fee();
      return { fee: Number(fee) };
    } catch (err) {
      console.warn('Address is not a V3 pool:', address, err);
      return { fee: null }; // или кинуть BadRequestException
    }
  }

}
