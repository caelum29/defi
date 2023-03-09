import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { createFile } from 'src/helpers/storage.helper';
import { Web3Service } from 'src/web3/web3.service';

@Injectable()
export class AppService {
  constructor(
    private readonly web3Service: Web3Service,
    @Inject('ADDRESSES')
    private readonly addresses: { tokenAddresses: string[]; address: string },
  ) {}
  async getBalances(): Promise<any> {
    try {
      const address = this.web3Service.checkAddress(this.addresses.address);
      const weis = await this.web3Service.getBalances(address);

      // const tokenAddresses = [
      //   '0x58b6A8A3302369DAEc383334672404Ee733aB239',
      //   // '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      //   '0x61fd1c62551850D0c04C76FcE614cBCeD0094498',
      //   '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39',
      //   '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
      //   '0xBDDab785b306BCD9fB056Da189615Cc8eCE1D823',
      //   '0xe530441f4f73bDB6DC2fA5aF7c3fC5fD551Ec838',
      //   '0x4c1C4957D22D8F373aeD54d0853b090666F6F9De',
      //   '0xf230b790E05390FC8295F4d3F60332c93BEd42e2',
      // ];

      const tokenBalances = await Promise.all(
        this.addresses.tokenAddresses.map(async (contractAddress) => {
          return this.web3Service.getBalanceAndNameOfContract(
            address,
            contractAddress,
          );
        }),
      );

      return {
        nativeBalance: this.web3Service.fromWei(weis),
        tokenCount: tokenBalances.length,
        tokenBalances,
      };
    } catch (e) {
      return new HttpException({ message: e.message }, 400);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async triggerCronJob() {
    console.log('Calling the method every minute');

    await createFile(
      './storage/',
      'balances.json',
      JSON.stringify(
        { ...(await this.getBalances()), time: new Date() },
        null,
        2,
      ),
    );
  }
}
