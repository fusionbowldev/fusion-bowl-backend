import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { HttpExceptionFilter } from './utils/filters/http-exception.filter';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    new HttpExceptionFilter(),
  );

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`
 Server running successfully
 URL: http://localhost:${port}
 Health: http://localhost:${port}/health
  `);
}

bootstrap();