export type BaseEntity = { id: string };

export interface Todo extends BaseEntity {
  value: string;
  done: boolean;
}
