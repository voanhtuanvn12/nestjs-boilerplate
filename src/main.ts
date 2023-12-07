import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { GLOBAL_ROOT_PREFIX } from './shared/constants/request';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.setGlobalPrefix(GLOBAL_ROOT_PREFIX);

  app.useLogger(app.get(Logger));
  const configService = app.get<ConfigService>(ConfigService);

  await setupSwagger(app);

  console.log(`---- APP PORT ${configService.get<number>('appPort')}`);
  await app.listen(configService.get<number>('appPort') || 3000);
}
bootstrap();
