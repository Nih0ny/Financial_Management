import { Injectable, NotFoundException } from '@nestjs/common';
import { ReceiptService } from 'src/receipt/receipt.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { PaymentType, Receipt } from 'src/entities/receipt.entity';
import { Category } from 'src/entities/category.entity';
import { AnalyticsResultDto } from './dto/analytics-result.dto';
import { Filter } from './interfaces/filter.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GetAnalyticsService {
  constructor(
    @InjectRepository(Receipt)
    private receiptRepository: Repository<Receipt>,
    private readonly receiptService: ReceiptService,
  ) {}
  async getAnalytics(filter: AnalyticsQueryDto): Promise<any> {
    const receipts = await this.receiptService.getFilteredReceipts({
      userId: 5,
      ...filter,
    });
    console.log(receipts);
    const arrOrder = filter.groupOrder?.split(',') ?? [];
    for (let i = arrOrder.length; i > 0; i--) {
      console.log(arrOrder.slice(0, i));
      console.log(
        '12', //await this.secondTry({ userId: 5, ...filter }, arrOrder.slice(0, i)),
      );
    }
    const grouped = this.groupReceipts(
      receipts,
      filter.groupOrder?.split(',') ?? [],
    );
    //this.calculateAnalytics(receipts, filter.groupOrder?.split(',') ?? []);
    return grouped;
  }

  private async getTotlaByGoups(
    filter: Filter,
    groupOrder: string[],
  ): Promise<any> {
    const query = this.receiptRepository
      .createQueryBuilder('receipt')
      .select('SUM(receipt.total)', 'total_sum');

    const userId = filter.userId;
    query.andWhere('receipt.userId = :userId', { userId });

    if (filter.merchants) {
      const merchants = filter.merchants.split(',');
      query.andWhere('receipt.merchant IN (:...merchants)', { merchants });
    }

    if (filter.categories) {
      const categoryNames = filter.categories.split(',');
      query.andWhere('receipt.categoryName IN (:...categoryNames)', {
        categoryNames,
      });
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

    // if (filter) {
    //   const groupOrder = groupOrder2;
    //   if (!groupOrder) return;
    //   for (const order of groupOrder) {
    //     query.addGroupBy(`receipt.${order}`);
    //     query.addSelect(`receipt.${order}`);
    //   }
    // }

    const res = await query.getRawMany();
    return res;
  }
}
