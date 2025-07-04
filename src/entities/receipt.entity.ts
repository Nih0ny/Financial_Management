import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { ReceiptItems } from './receipt-items.entity';

export enum PaymentType {
  CASH = 'cash',
  CARD = 'card',
  OTHER = 'other',
}

@Entity()
export class Receipt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.receipts)
  user: User;

  @Column({ type: 'text', nullable: true })
  photoPath: string;

  @Column()
  merchant: string;

  @ManyToOne(() => Category, (categoty) => categoty.receipts, {
    eager: true,
  })
  category: Category;

  @OneToMany(() => ReceiptItems, (items) => items.reciept, {
    cascade: true,
    eager: true,
  })
  items: ReceiptItems[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.OTHER,
  })
  paymentType: PaymentType;

  @Column({ type: 'timestamp' })
  date: Date;
}
