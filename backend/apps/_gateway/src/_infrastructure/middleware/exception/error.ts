import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { errorHttpHandler } from './http';

@Catch()
export class ErrorHandler implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      await errorHttpHandler(exception, host, this.i18n);
    } else {
      // await errorWsHandler(exception, host, this.i18n);
    }
  }
}
