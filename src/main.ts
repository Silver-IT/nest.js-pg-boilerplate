import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

import { AppModule } from './app.module';
import { SeedsService } from './seeds/seeds.service';
import { maxHttpBodySize } from './common/constants/general.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: maxHttpBodySize }));
  app.use(bodyParser.urlencoded({ limit: maxHttpBodySize, extended: true }));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  // Seeding Database
  const seedService = app.get(SeedsService);
  await seedService.start();

  // Swagger API Document Migration
  const options = new DocumentBuilder()
    .setTitle('Nest.js + PostgreSQL Boilerplate')
    .setDescription('Swagger API documentation for "Nest.js + PostgreSQL Boilerplate Backend".')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('doc', app, document);

  await app.listen(process.env.PORT || 3030);
}
bootstrap();
