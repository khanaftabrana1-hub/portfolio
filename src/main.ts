import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();

  const port = configService.getOrThrow<number>('PORT');
  await app.listen(port);
  app.useGlobalInterceptors(
    new TransformInterceptor()
  );


}
bootstrap();