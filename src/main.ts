import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './exceptions/global.exception';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { getRepository } from 'typeorm';
// import { staffPermissionEntity } from './model/staffPermission.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('NepaliGPT')
    .setDescription('API Documentation for NepaliGPT')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'access-token',
        description: 'Enter access-token',
        in: 'header',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customCss: `
      .swagger-ui { background-color: #1f1f1f; }
      .swagger-ui .scheme-container { background-color: #1f1f1f; }
      .title { color: white !important; }
      .nostyle { color: white !important; }
      .opblock-body { background-color: #CCCCCC !important; }
      .swagger-ui .info { color: white; }
      .model-box { background-color: #cccccc !important; }
    `,
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapterHost));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT || 3040);
}
bootstrap()
  .then(() => {
    console.log(`Server started in http://localhost:${process.env.PORT}/api`);
  })
  .catch((e) =>
    console.error(`Error started while server starting as \n ${e.message}`),
  );
