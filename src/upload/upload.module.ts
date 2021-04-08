import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { UploadController } from './upload.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './public/uploads',
      }),
    }),
  ],
  controllers: [UploadController],
})
export class UploadModule {}
