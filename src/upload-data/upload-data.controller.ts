import {
  Body,
  Controller,
  FileTypeValidator,
  Inject,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadDataService } from './upload-data.service';
import { ReceiptManualDto } from './dto/receipt-manual.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfirmReceipParsingDto } from './dto/confirm-receipt-parsing.dto';

@Controller('upload-data')
@UseGuards(AuthGuard)
export class UploadDataController {
  constructor(private readonly uploadDataService: UploadDataService) {}

  @Post('manual')
  async Manual(
    @Body() body: ReceiptManualDto,
    @Request() req: { user: { email: string } },
  ) {
    await this.uploadDataService.createManualReceipt(body, req.user.email);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('receipt'))
  async ImageParse(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image/ }),
        ],
      }),
    )
    receipt: Express.Multer.File,
    @Request() req: { user: { email: string } },
  ) {
    return await this.uploadDataService.acceptReceiptImage(
      receipt.buffer.toString('base64'),
      req.user.email,
    );
  }

  @Post('image/confirm')
  async ConfirmImageParsing(
    @Body() body: ConfirmReceipParsingDto,
    @Request() req: { user: { email: string } },
  ) {
    await this.uploadDataService.confirmReceipParsing(body, req.user.email);
  }
}
