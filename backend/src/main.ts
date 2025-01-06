import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir requisições do frontend
  app.enableCors();

  // Usar pipes de validação do NestJS
  app.useGlobalPipes(new ValidationPipe());

  // Configurações básicas do Swagger
  const config = new DocumentBuilder()
    .setTitle('Simple Tasker')
    .setDescription('API de tarefas simples')
    .setVersion('1.0')
    // Se quiser adicionar algo como BearerAuth, etc, você pode usar .addBearerAuth()
    .build();

  // Criação do documento
  const document = SwaggerModule.createDocument(app, config);

  // Rota onde a documentação estará disponível, ex.: http://localhost:4000/docs
  SwaggerModule.setup('docs', app, document);

  await app.listen(4000);
  console.log('Backend running on http://localhost:4000');
  console.log('Swagger docs running on http://localhost:4000/docs');
}

bootstrap();
