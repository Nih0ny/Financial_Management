import {
  Controller,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ReceiptGuard } from './receipt.guard';

@Controller('receipt')
@UseGuards(AuthGuard, ReceiptGuard)
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReceiptDto: UpdateReceiptDto,
  ) {
    return this.receiptService.update(+id, updateReceiptDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    if (!(await this.receiptService.delete(id))) throw new NotFoundException();
  }
}
