import { DynamicModule, Module } from '@nestjs/common';
import { ModuleAsyncOptions } from 'src/shared/types';
import { Web3Service } from 'src/web3/web3.service';
import { WEB3_OPTIONS_SYMBOL, Web3Options } from 'src/web3/web3.types';

@Module({})
export class Web3Module {
  static register(opts: ModuleAsyncOptions<Web3Options>): DynamicModule {
    return {
      module: Web3Module,
      imports: opts.imports || [],
      providers: [
        {
          provide: WEB3_OPTIONS_SYMBOL,
          useFactory: opts.useFactory,
          inject: opts.inject || [],
        },
        Web3Service,
      ],
      exports: [Web3Service],
    };
  }
}
