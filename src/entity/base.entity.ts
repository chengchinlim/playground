import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: "created_at",
    default: () => "NOW()",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    default: () => "NOW()",
  })
  updatedAt: Date;
}
