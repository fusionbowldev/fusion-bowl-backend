import { HttpException } from '@nestjs/common';

export class CustomException extends HttpException {

  constructor(
    public readonly errorCode: string,
    public readonly errorMessage: string,
    public readonly statusCode: number = 400,
    public readonly metadata?: any,
  ) {

    super(
      {
        success: false,

        errorCode,

        errorMessage,

        statusCode,

        metadata,
      },
      statusCode,
    );
  }
}