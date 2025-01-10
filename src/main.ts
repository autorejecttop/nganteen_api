import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCsrfProtection from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import fastifyMultipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );

  // This enables Helmet, it can help protect against
  // some well known web vulnerabilities by setting
  // HTTP headers. The order of applied middlewares
  // is important!
  // Read more: https://docs.nestjs.com/security/helmet#use-with-fastify, https://helmetjs.github.io/
  await app.register(fastifyHelmet);

  // This enables CSRF/XSRF protection.
  // Read more: https://docs.nestjs.com/security/csrf#use-with-fastify
  await app.register(fastifyCsrfProtection);

  // This enables CORS and allow every IP addresses.
  // For better security, please try to limit them
  // to only trusted IP addresses.
  // Read more: https://docs.nestjs.com/security/cors
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // This enables serialization of returned objects.
  // It is used for excluding passwords and other sensitive data
  // from being returned.
  // Read more: https://docs.nestjs.com/techniques/serialization#exclude-properties
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.register(fastifyMultipart);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
