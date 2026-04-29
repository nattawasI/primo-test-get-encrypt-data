import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation Pipe for DTOs
  app.useGlobalPipes(new ValidationPipe());

  // Swagger UI Configuration
  const config = new DocumentBuilder()
    .setTitle('Primo Crypto API')
    .setDescription('API for encrypting and decrypting data using AES and RSA')
    .setVersion('1.0')
    .addTag('Crypto')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`\n🚀 Application is running on: http://localhost:3000`);
  console.log(
    `📖 Swagger UI is available at: http://localhost:3000/api-docs\n`,
  );
}
bootstrap().catch((err) => {
  console.error('Error starting server', err);
});
