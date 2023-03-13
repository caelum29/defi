import {
  Abstract,
  DynamicModule,
  ForwardReference,
  Type,
} from '@nestjs/common';

export interface ModuleAsyncOptions<T> {
  useFactory: (...args: unknown[]) => T | Promise<T>;
  imports?: ModuleImport;
  inject?: ProviderInject;
}

export type ModuleImport = Array<
  Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
>;

export type ProviderInject = Array<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  Type<any> | string | symbol | Abstract<any> | Function
>;
