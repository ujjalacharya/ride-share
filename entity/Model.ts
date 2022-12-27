import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export default abstract class Model extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  constructor(model?: Partial<any>) {
    super();
    Object.assign(this, model);
  }

  // toJSON() {
  //   return { ...this, id: undefined };
  // }
}
