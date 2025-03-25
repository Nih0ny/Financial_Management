import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Receipt } from './receipt.entity';

@Entity()
export class Category {
  @PrimaryColumn({ type: 'varchar', length: 40 })
  name: string;

  @OneToMany(() => Receipt, (receipt) => receipt.category)
  receipts: Receipt[];
}
