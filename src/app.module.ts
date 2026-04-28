import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CryptoService } from './crypto/crypto.service';
import { CryptoController } from './crypto/crypto.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, CryptoController],
  providers: [AppService, CryptoService],
})
export class AppModule {}
