import {
  HttpException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { createFile } from 'src/helpers/storage.helper';
import { Web3Service } from 'src/web3/web3.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly web3Service: Web3Service,
    private schedulerRegistry: SchedulerRegistry,
    @Inject('ADDRESSES')
    private readonly addresses: { tokenAddresses: string[]; address: string },
  ) {}
  async getBalances(): Promise<any> {
    try {
      const address = this.web3Service.checkAddress(this.addresses.address);
      const weis = await this.web3Service.getBalances(address);

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

  // it's working but not correctly
  // @Cron(CronExpression.EVERY_MINUTE, { name: 'writeBalances' })
  // async triggerCronJob() {
  //   console.log('Calling the method every minute');
  //
  //   await createFile(
  //     './storage/',
  //     'balances.json',
  //     JSON.stringify(
  //       { ...(await this.getBalances()), time: new Date() },
  //       null,
  //       2,
  //     ),
  //   );
  // }

  // this one is correct bun maybe not so fancy
  onModuleInit() {
    const callback = async () => {
      await createFile(
        './storage/',
        'balances.json',
        JSON.stringify(
          { ...(await this.getBalances()), time: new Date() },
          null,
          2,
        ),
      );
      this.schedulerRegistry.deleteTimeout('writeFile');

      this.onModuleInit();
    };

    const timeout = setTimeout(callback, 1000 * 60);

    this.schedulerRegistry.addTimeout('writeFile', timeout);
  }
}
