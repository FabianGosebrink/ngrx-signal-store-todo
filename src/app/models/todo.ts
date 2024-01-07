import { BaseEntity } from './base-entitiy';

export interface Todo extends BaseEntity {
  value: string;
  done: boolean;
}
