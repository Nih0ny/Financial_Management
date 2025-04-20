import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { GetAnalyticsService } from './get-analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Receipt } from 'src/entities/receipt.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('get-analytics')
@UseGuards(AuthGuard)
export class GetAnalyticsController {
  constructor(
    @InjectRepository(Receipt)
    private receiptRepository: Repository<Receipt>,
    private readonly getAnalyticsService: GetAnalyticsService,
  ) {}

  @Get()
  async getAnalyticsReq(@Query() query: AnalyticsQueryDto) {
    return this.getAnalytics(query);
  }

  async getAnalytics(filter: AnalyticsQueryDto): Promise<any> {
    const receipts = await this.getFilteredReceipts(filter);
    const grouped = this.groupReceipts(
      receipts,
      filter.groupOrder?.split(',') ?? [],
    );
    return grouped;
  }

  private async getFilteredReceipts(
    filter: AnalyticsQueryDto,
  ): Promise<Receipt[]> {
    const query = this.receiptRepository
      .createQueryBuilder('receipt')
      .leftJoinAndSelect('receipt.category', 'category')
      .where('receipt.userId = :userId', { userId: 5 });

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
      const types = filter.paymentTypes.split(',');
      query.andWhere('receipt.paymentType IN (:...types)', { types });
    }

    if (filter.categories) {
      const names = filter.categories.split(',');
      query.andWhere('category.name IN (:...names)', { names });
    }

    if (filter.merchants) {
      const merchants = filter.merchants.split(',');
      query.andWhere('receipt.merchant IN (:...merchants)', { merchants });
    }

    if (filter.totalFrom) {
      query.andWhere('receipt.total >= :totalFrom', {
        totalFrom: +filter.totalFrom,
      });
    }

    if (filter.totalTo) {
      query.andWhere('receipt.total <= :totalTo', {
        totalTo: +filter.totalTo,
      });
    }

    return query.getMany();
  }

  private groupReceipts(receipts: Receipt[], groupOrder: string[]): any {
    const grouped = {};

    // Групуємо чеки по вказаних параметрах
    for (const receipt of receipts) {
      let current: any = grouped;

      for (const group of groupOrder) {
        let key: string;

        switch (group) {
          case 'categories':
            key = receipt.category?.name ?? 'Unknown';
            break;
          case 'date':
            key = receipt.date.toISOString().split('T')[0]; // Форматируем дату
            break;
          case 'paymentTypes':
            key = receipt.paymentType;
            break;
          case 'merchants':
            key = receipt.merchant; // Групування по merchant
            break;
          default:
            key = 'Unknown';
        }

        if (!current[key]) {
          current[key] = {};
        }

        current = current[key];
      }

      // Створюємо поле для підсумків, якщо його немає
      if (!current.total) {
        current.total = 0;
        current.count = 0;
      }

      // Нараховуємо загальну суму та кількість для конкретного рівня
      current.total += Number(receipt.total);
      current.count += 1;

      // Додаємо загальні підсумки для вищих рівнів групування
      this.addAggregatedTotals(grouped); // Оновлення підсумків на вищих рівнях
    }

    // Додаємо відсотки всередині найглибших рівнів
    this.calculatePercents(grouped);

    return grouped;
  }

  // Функція для додавання загальних підсумків на кожному рівні групування
  private addAggregatedTotals(group: any) {
    // Проходимо по всіх рівнях, щоб додати загальний підсумок на більш загальних рівнях
    Object.keys(group).forEach((key) => {
      let currentGroup: any = group[key];

      // Перевіряємо, чи є поточний елемент об'єктом або числом
      if (typeof currentGroup === 'number') {
        // Якщо це число (наприклад, total), то пропускаємо додавання підсумків
        return;
      }

      // Якщо це кінцевий рівень (наприклад, типи платежів), додаємо загальні підсумки
      if (!currentGroup.card && !currentGroup.cash) {
        const total = currentGroup.total || 0;
        const count = currentGroup.count || 0;
        currentGroup.total = total; // <------ here
        currentGroup.count = count;
        currentGroup.inPercent = this.calculatePercentage(total, count);
      } else {
        // Якщо є підкатегорії (наприклад, за датою), додаємо підсумки для цієї групи
        let total = 0;
        let count = 0;

        Object.keys(currentGroup).forEach((subKey) => {
          total += currentGroup[subKey].total || 0;
          count += currentGroup[subKey].count || 0;
        });

        currentGroup.total = total;
        currentGroup.count = count;
        currentGroup.inPercent = this.calculatePercentage(total, count);
      }

      // Якщо є підкатегорії, викликаємо рекурсивно для них
      if (currentGroup && typeof currentGroup === 'object') {
        this.addAggregatedTotals(currentGroup);
      }
    });
  }

  // Функція для розрахунку відсотків
  private calculatePercentage(total: number, count: number): number {
    // Якщо є хоча б один запис, обчислюємо відсотки
    return count ? total / count : 0;
  }

  private calculatePercents(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        const sub = obj[key];

        if ('total' in sub && 'count' in sub) {
          // Найглибший рівень — не обчислюємо
        } else {
          this.calculatePercents(sub);

          const totalSum: any = Object.values(sub)
            .filter(
              (v: any) =>
                typeof v === 'object' && v != null && v.total !== undefined,
            )
            .reduce((sum, v: any) => sum + v.total, 0);

          for (const subKey in sub) {
            if (
              typeof sub[subKey] === 'object' &&
              sub[subKey].total !== undefined
            ) {
              sub[subKey].inPercent = +(
                (sub[subKey].total * 100) /
                totalSum
              ).toFixed(2);
            }
          }
        }
      }
    }
  }
}
