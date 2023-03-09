import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { Web3Module } from 'src/web3/web3.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    Web3Module.register({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        url: configService.config.url,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      inject: [ConfigService],
      provide: 'ADDRESSES',
      useFactory: (configService: ConfigService) => ({
        tokenAddresses: configService.config.tokenAddresses,
        address: configService.config.walletAddress,
      }),
    },
  ],
})
export class AppModule {}
