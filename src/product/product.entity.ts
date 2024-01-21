import { Column, Entity } from "typeorm";
import { BaseEntity } from "../entity/base.entity";

@Entity("products")
export class ProductEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  category: string;
}
