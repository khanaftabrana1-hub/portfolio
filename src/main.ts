import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const port = Number(process.env.PORT?.toString().replace(/[^0-9]/g, ''));

  await app.listen(port);
  console.log(`🚀 Application is running on port: ${port}`);
}
bootstrap();



