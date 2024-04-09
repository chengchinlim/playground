import { Column, Entity } from "typeorm";
import { BaseEntity } from "../entity/base.entity";

@Entity("users")
export class UserEntity extends BaseEntity {
  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  authToken?: string;
}
