import { Inject, Injectable } from '@nestjs/common';
import { WEB3_OPTIONS_SYMBOL, Web3Options } from 'src/web3/web3.types';
import Web3 from 'web3';
import { AbiType } from 'web3-utils';

@Injectable()
export class Web3Service {
  private readonly web3: Web3;

  constructor(
    @Inject(WEB3_OPTIONS_SYMBOL) private readonly options: Web3Options,
  ) {
    const provider = new Web3.providers.HttpProvider(options.url);
    this.web3 = new Web3(provider);
  }

  async getBalances(address: string): Promise<any> {
    return await this.web3.eth.getBalance(address);
  }

  checkAddress(address: string): string {
    return this.web3.utils.toChecksumAddress(address);
  }

  fromWei(wei: string): string {
    return this.web3.utils.fromWei(wei, 'ether');
  }

  async getBalanceAndNameOfContract(address: string, erc20Address: string) {
    const minABI = [
      // balanceOf
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function' as AbiType,
      },
      //symbol
      {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        type: 'function' as AbiType,
      },
    ];

    const tokenContract = new this.web3.eth.Contract(minABI, erc20Address);

    const wei = await tokenContract.methods.balanceOf(address).call();

    const balance = this.fromWei(wei);

    const name = await tokenContract.methods.symbol().call();

    return { name, balance };
  }
}
