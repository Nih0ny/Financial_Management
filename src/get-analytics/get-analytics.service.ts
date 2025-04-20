import { Injectable } from '@nestjs/common';
import { ReceiptService } from 'src/receipt/receipt.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';

@Injectable()
export class GetAnalyticsService {
  constructor(private readonly receiptService: ReceiptService) {}
  // async getAnalytics(filter: AnalyticsQueryDto, userId: number): Promise<any> {
  //   const receipts = await this.receiptService.getFilteredReceipts({
  //     ...filter,
  //     userId,
  //   });
  //   const grouped = this.groupReceipts(
  //     receipts,
  //     filter.groupOrder?.split(',') ?? [],
  //   );
  //   return grouped;
  // }

  // private groupReceipts(receipts: Receipt[], groupOrder: string[]): any {
  //   const grouped = {};

  //   for (const receipt of receipts) {
  //     let current = grouped;

  //     for (const group of groupOrder) {
  //       let key: string;

  //       switch (group) {
  //         case 'categories':
  //           key = receipt.category?.name ?? 'Unknown';
  //           break;
  //         case 'date':
  //           key = receipt.date.toISOString().split('T')[0];
  //           break;
  //         case 'paymentTypes':
  //           key = receipt.paymentType;
  //           break;
  //         default:
  //           key = 'Unknown';
  //       }

  //       if (!current[key]) {
  //         current[key] = {};
  //       }

  //       current = current[key];
  //     }

  //     if (!current.total) {
  //       current.total = 0;
  //       current.count = 0;
  //     }

  //     current.total += Number(receipt.total);
  //     current.count += 1;
  //   }

  //   // Додаємо відсотки всередині найглибших рівнів
  //   this.calculatePercents(grouped);

  //   return grouped;
  // }

  // private calculatePercents(obj: any) {
  //   for (const key in obj) {
  //     if (typeof obj[key] === 'object' && obj[key] !== null) {
  //       const sub = obj[key];

  //       if ('total' in sub && 'count' in sub) {
  //         // Найглибший рівень — не обчислюємо
  //       } else {
  //         this.calculatePercents(sub);

  //         const totalSum = Object.values(sub)
  //           .filter((v) => typeof v === 'object' && v.total !== undefined)
  //           .reduce((sum, v: any) => sum + v.total, 0);

  //         for (const subKey in sub) {
  //           if (
  //             typeof sub[subKey] === 'object' &&
  //             sub[subKey].total !== undefined
  //           ) {
  //             sub[subKey].inPercent = +(
  //               (sub[subKey].total * 100) /
  //               totalSum
  //             ).toFixed(2);
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
}
