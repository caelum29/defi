import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as fs from 'fs';
import { ConfigModuleOptions } from 'src/config/config.module';
import { ConfigT } from 'src/config/template/config.template';

export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';

@Injectable()
export class ConfigService {
  private readonly c: ConfigT;

  constructor(@Inject('CONFIG_OPTIONS') options: ConfigModuleOptions) {
    const configObj = JSON.parse(
      fs.readFileSync(options.configPath).toString(),
    );
    const config = plainToClass(ConfigT, configObj);
    this.validate(config);
    this.c = config;
  }

  get config(): ConfigT {
    return this.c;
  }

  private validate(obj: Record<string, any>): void {
    const errors = validateSync(obj, {
      forbidNonWhitelisted: true,
    });
    if (errors.length > 0) {
      throw new Error(JSON.stringify(errors[0]?.constraints, null, 2));
    }
  }
}
