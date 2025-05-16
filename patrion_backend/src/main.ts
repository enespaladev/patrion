import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/winston.logger';

import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const logger = new Logger('ManualTest');
  logger.warn('🧪 Winston log dosyasına yazma testi');

  app.useGlobalFilters(new AllExceptionsFilter());
  
  app.enableCors({
    origin: 'http://localhost:3001', // frontend adresin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
