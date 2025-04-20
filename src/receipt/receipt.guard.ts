import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { Receipt } from 'src/entities/receipt.entity';

@Injectable()
export class ReceiptGuard implements CanActivate {
  constructor(private receiptService: ReceiptService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: {
      user: { id: number };
      params: { id: string };
      receipt: Receipt;
    } = context.switchToHttp().getRequest();

    const userId = request.user.id;
    const receiptId = request.params.id;

    const receipt = await this.receiptService.findOne(+receiptId);
    if (!receipt) throw new NotFoundException('Receipt not found');

    if (receipt.user.id !== userId) {
      throw new ForbiddenException('Access denied');
    }

    request.receipt = receipt;

    return true;
  }
}
