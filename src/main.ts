import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const PORT = 8081;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('File Storage API')
    .setDescription(
      'A REST API for managing file uploads with JSON validation and metadata tracking',
    )
    .setVersion('1.0.0')
    .addTag('File Storage', 'File upload and retrieval operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT);
  console.log(`Application is running on: http://localhost:${PORT}`);
  console.log(
    `Swagger documentation available at: http://localhost:${PORT}/api/docs`,
  );
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
