import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const PORT = process.env.NODE_APP_PORT ?? 8001;

  const config = new DocumentBuilder()
    .setTitle('Custom All')
    .setDescription('The Custom All API description')
    .setVersion('1.0')
    .addTag('Custom All')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

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

  await app.listen(PORT);

  Logger.log(
    `Compiled successfully on port: \x1b[34m${PORT}\x1b[0m`,
    'NestApplication',
  );
}
bootstrap().catch(() => process.exit(1));
