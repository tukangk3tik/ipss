// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: `env/${process.env.NODE_ENV}.env` });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  I18nService,
  I18nValidationExceptionFilter,
  I18nValidationPipe,
} from 'nestjs-i18n';
import { ErrorHandler } from './_infrastructure/middleware/exception/error';

async function bootstrap() {
  console.log(process.env.DATABASE_URL);

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(new I18nValidationPipe());

  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      detailedErrors: false,
    }),
  );
  app.useGlobalFilters(new ErrorHandler(app.get(I18nService)));
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
