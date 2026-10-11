import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter
  implements ExceptionFilter {

  catch(exception: any, host: ArgumentsHost) {

    const ctx =
      host.switchToHttp();

    const response =
      ctx.getResponse();

    const request =
      ctx.getRequest();

    // custom exception response
    if (
      exception?.response?.errorCode
    ) {

      return response
        .status(
          exception.response.statusCode,
        )
        .json({

          ...exception.response,

          path: request.url,

          timestamp: new Date(),
        });
    }

    // fallback
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({

      success: false,

      errorCode:
        'INTERNAL_SERVER_ERROR',

      errorMessage:
        exception?.message ||
        'Something went wrong',

      statusCode: status,

      path: request.url,

      timestamp: new Date(),
    });
  }
}