import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './common/config';
import { ContactModule } from './contact/contact.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(
      { isGlobal: true }
    ),
    TypeOrmModule.forRootAsync(typeOrmConfig), 
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}