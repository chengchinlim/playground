import {
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class BaseEntity {
  @PrimaryColumn()
  id: number;

  @CreateDateColumn({
    name: "created_at",
    default: () => "NOW()",
    type: "timestamptz",
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    default: () => "NOW()",
    type: "timestamptz",
  })
  updatedAt: Date;
}
