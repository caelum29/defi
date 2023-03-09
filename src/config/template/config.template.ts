import { IsArray, IsString } from 'class-validator';

export class ConfigT {
  @IsString()
  url: string;

  @IsString()
  walletAddress: string;

  @IsArray()
  tokenAddresses: string[];
}
