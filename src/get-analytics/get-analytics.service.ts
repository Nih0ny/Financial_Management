import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { NestedNode } from './interfaces/nested-node.interface';
import { ReceiptService } from 'src/receipt/receipt.service';
import * as moment from 'moment';
import { GroupedReceiptTotalsResult } from 'src/receipt/interfaces/query-result.interface';

@Injectable()
export class GetAnalyticsService {
  constructor(private readonly receiptService: ReceiptService) {}

  async getAnalytics(
    filter: AnalyticsQueryDto,
    userId: number,
  ): Promise<NestedNode> {
    const groupOrder = filter.groupOrder?.split(',') ?? [];
    const { dateFormat, ...queryFilter } = filter;

    const queryResult = await this.receiptService
      .getGroupedReceiptTotals({ userId, ...queryFilter }, groupOrder)
      .catch(() => {
        throw new BadRequestException(
          'Invalid query. Please verify your request parameters and try again.',
        );
      });

    return this.buildNestedStructure(
      queryResult,
      groupOrder,
      'total',
      'ids',
      dateFormat,
    );
  }

  private buildNestedStructure(
    data: GroupedReceiptTotalsResult[],
    keys: string[],
    valueKey: string,
    idKey: string,
    dateFormat?: string,
  ): NestedNode {
    const root: NestedNode = {};
    let grandTotal = 0;

    for (const item of data) {
      const value = parseFloat(item[valueKey] as string);
      grandTotal += value;

      let currentLevel: NestedNode = root;

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        const keyValue =
          key === 'date' && dateFormat
            ? moment(item[key] as Date).format(dateFormat)
            : (item[key] as string);

        console.log(key, ' : ', keyValue);
        if (dateFormat) console.log(dateFormat);

        if (typeof keyValue !== 'string') continue;

        if (typeof currentLevel[keyValue] !== 'object') {
          currentLevel[keyValue] = {};
        }

        const childNode = currentLevel[keyValue] as NestedNode;

        if (!childNode.total) {
          childNode.total = '0';
        }

        childNode.total = (parseFloat(childNode.total) + value).toFixed(2);

        currentLevel = childNode;

        if (i === keys.length - 1) {
          const rawIds = (item[idKey] as string) ?? '';
          const ids = rawIds.split(',').map((id: string) => id.trim());
          childNode.ids = childNode.ids
            ? Array.from(new Set([...childNode.ids, ...ids]))
            : ids;
        }
      }
    }

    const formatAndAddPercent = (
      node: NestedNode,
      parentTotal: number,
    ): void => {
      for (const key in node) {
        const child = node[key];
        if (
          typeof child === 'object' &&
          child !== null &&
          'total' in child &&
          typeof child.total === 'string'
        ) {
          const childTotal = parseFloat(child.total);
          if (parentTotal > 0) {
            child.inPercent = ((childTotal / parentTotal) * 100).toFixed(2);
          }

          const hasChildren = Object.entries(child).some(
            ([k, v]) =>
              typeof v === 'object' &&
              k !== 'ids' &&
              k !== 'inPercent' &&
              k !== 'total',
          );

          if (hasChildren) {
            formatAndAddPercent(child, childTotal);
          }
        }
      }
    };

    formatAndAddPercent(root, grandTotal);
    root.total = grandTotal.toFixed(2);

    return root;
  }
}
