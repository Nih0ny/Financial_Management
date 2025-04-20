import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { PaymentType, Receipt } from 'src/entities/receipt.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReceiptItemsService } from 'src/receipt-items/receipt-items.service';
import { ReceiptItemDto } from 'src/upload-data/dto/receipt-item.dto';
import { ReceiptFilterDto } from './dto/receipt-filter.dto';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt)
    private receiptRepository: Repository<Receipt>,
    private readonly receiptItemsService: ReceiptItemsService,
  ) {}

  async findAllByUser(userId: number): Promise<Receipt[]> {
    return await this.receiptRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findOne(id: number): Promise<Receipt | null> {
    return await this.receiptRepository.findOne({
      where: { id: id },
      relations: ['user'],
    });
  }

  async create(receipt: CreateReceiptDto): Promise<Receipt> {
    const newReceipt = this.receiptRepository.create(receipt);
    return await this.receiptRepository.save(newReceipt);
  }

  async update(
    id: number,
    newReceipt: UpdateReceiptDto,
  ): Promise<UpdateReceiptDto> {
    const receipt: Receipt | null = await this.receiptRepository.findOneBy({
      id,
    });
    if (!receipt) throw new NotFoundException('Receipt not found');

    const { photoPath, ...receiptWithoutPhoto } = receipt;

    const updatedReceipt = {
      ...receiptWithoutPhoto,
      ...newReceipt,
      ...(photoPath ? { photoPath } : {}),
    };

    if (!this.checkTotal(updatedReceipt.items, updatedReceipt.total))
      throw new BadRequestException(
        'Total in receipt is not watch with real total',
      );

    await this.receiptItemsService.deleteAll(receipt.items);
    await this.receiptRepository.save(updatedReceipt);

    updatedReceipt.photoPath =
      updatedReceipt.photoPath == null ? undefined : updatedReceipt.photoPath;
    return updatedReceipt;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.receiptRepository.delete(id);
    return !result.affected ? false : true;
  }

  checkTotal(items: ReceiptItemDto[], receiptTotal: number): boolean {
    const total = items.reduce(
      (total, currentValue) =>
        (total += currentValue.price * currentValue.amount),
      0,
    );

    return total == receiptTotal;
  }

  async getFilteredReceipts(filter: ReceiptFilterDto): Promise<Receipt[]> {
    const query = this.receiptRepository
      .createQueryBuilder('receipt')
      .leftJoinAndSelect('receipt.category', 'category')
      .leftJoinAndSelect('receipt.items', 'items');

    const userId = filter.userId;
    query.andWhere('receipt.userId = :userId', { userId });

    if (filter.merchants) {
      const merchants = filter.merchants.split(',');
      query.andWhere('receipt.merchant IN (:...merchants)', { merchants });
    }

    if (filter.categories) {
      const categoryNames = filter.categories.split(',');
      query.andWhere('category.name IN (:...categoryNames)', { categoryNames });
    }

    if (filter.startDate) {
      query.andWhere('receipt.date >= :startDate', {
        startDate: new Date(filter.startDate),
      });
    }

    if (filter.endDate) {
      query.andWhere('receipt.date <= :endDate', {
        endDate: new Date(filter.endDate),
      });
    }

    if (filter.paymentTypes) {
      const paymentTypes = filter.paymentTypes.split(',') as PaymentType[];
      query.andWhere('receipt.paymentType IN (:...paymentTypes)', {
        paymentTypes,
      });
    }

    if (filter.totalFrom) {
      query.andWhere('receipt.total >= :totalFrom', {
        totalFrom: parseFloat(filter.totalFrom),
      });
    }

    if (filter.totalTo) {
      query.andWhere('receipt.total <= :totalTo', {
        totalTo: parseFloat(filter.totalTo),
      });
    }

    return query.getMany();
  }
}
