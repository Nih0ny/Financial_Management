import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Receipt } from './receipt.entity';

@Entity()
export class ReceiptItems {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Receipt, (receipt) => receipt.items)
  reciept: Receipt;

  @Column()
  product: string;

  @Column()
  amount: number;

  @Column({ type: 'float', precision: 10, scale: 2 })
  price: number;
}
