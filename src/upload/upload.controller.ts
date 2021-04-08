import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UploadResponse } from '../common/dtos/response-types.dto';
import {
  editFileName,
  imageFileFilter,
} from '../common/utils/file-upload.utils';

@ApiTags('Upload Management')
@Controller('api/uploads')
export class UploadController {
  @Post('shapes')
  @ApiOkResponse({ type: UploadResponse })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads/shapes',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async uploadFile(@UploadedFile() file): Promise<UploadResponse> {
    const url = `uploads/shapes/${file.filename}`;
    return new UploadResponse(url);
  }
}
