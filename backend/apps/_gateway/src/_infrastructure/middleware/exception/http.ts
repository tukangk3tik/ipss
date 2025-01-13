import { ArgumentsHost, HttpException } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { GlobalError } from '../../../_domain/dtos/global.error';

export async function errorHttpHandler(
  exception: HttpException,
  host: ArgumentsHost,
  i18n: I18nService,
) {
  const ctx = host.switchToHttp();
  const response = ctx.getResponse();
  const request = ctx.getRequest();

  const status = exception.getStatus();

  let error = exception.message;
  if (exception.getResponse() instanceof GlobalError) {
    const errorData = exception.getResponse() as GlobalError;
    error = i18n.t(errorData.error_key, {
      lang: I18nContext.current().lang,
      args: errorData.error_args,
    });
  }

  const body = {
    statusCode: status,
    message: error as string,
    timestamp: new Date().toISOString(),
    endpoint: request.url,
  } as Record<string, unknown>;

  response.status(status).send(body);
}
