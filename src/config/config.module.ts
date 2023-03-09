import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService, CONFIG_OPTIONS } from 'src/config/config.service';

export interface ConfigModuleOptions {
  configPath: string;
}

@Global()
@Module({})
export class ConfigModule {
  static forRoot(
    options: ConfigModuleOptions = {
      configPath: `./config/${process.env.NODE_ENV}.json`,
    },
  ): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
