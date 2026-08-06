import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const firstError = errors[0];
        const firstMessage = Object.values(firstError.constraints!)[0];

        return new BadRequestException({
          status: false,
          message: firstMessage,
        });
      },
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.NODE_APP_PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
  process.exit(1);
});
