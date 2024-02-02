import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const authIssuer = configService.get<string>('AUTH0_ISSUER_URL');
  const authAudience = configService.get<string>('AUTH0_AUDIENCE');

  const config = buildSwaggerConfig(authIssuer, authAudience);
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      initOAuth: {
        clientId: configService.get<string>('AUTH0_CLIENT_ID'),
      },
    },
  });

  await app.listen(process.env.PORT || 3000);
}

const buildSwaggerConfig = (authIssuer: string, authAudience: string) =>
  new DocumentBuilder()
    .setTitle('User service API')
    .setVersion('1.0')
    .addTag('user')
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: `${authIssuer}authorize?audience=${authAudience}`,
            tokenUrl: authAudience,
            scopes: {
              openid: 'Open Id',
              profile: 'Profile',
              email: 'E-mail',
            },
          },
        },
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'auth0',
    )
    .build();

bootstrap();
