import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WsAdapter } from '@nestjs/platform-ws';
import { ConfigService } from '@nestjs/config';
import { isMainThread } from 'worker_threads';
import { ImportWorkerModule } from './import-worker.module';
import { SongImporterManagerService } from './modules/song-store/services/song-importer-manager.service';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiModule } from './modules/api/api.module';
import { CommandFactory } from 'nest-commander';
import { CliCommandsModule } from './modules/cli-commands/cli-commands.module';
import { AuthModule } from './modules/auth/auth.module';

async function bootstrap() {
  if (isMainThread && process.argv[2] == '--serve') {
    console.log('NODE_ENV', { nodeEnv: process.env.NODE_ENV });

    const app = await NestFactory.create(AppModule);
    app.useWebSocketAdapter(new WsAdapter(app));
    const config = app.get(ConfigService);
    app.enableCors({
      credentials: true,
      // origin: '*',
      origin: 'http://localhost:4200',
    });
    app.use(cookieParser());

    const swaggerConfig = new DocumentBuilder()
      .setTitle('Requestobot API')
      .setDescription('The Requestobot API')
      .setVersion('1.4.2')
      .addCookieAuth('jwt')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig, {
      include: [ApiModule, AuthModule],
    });
    SwaggerModule.setup('api', app, document);

    const logger = app.get(Logger);
    const port = config.get('PORT') ?? 3000;
    logger.log(`Starting server on port ${port}`);

    await app.listen(port);
  } else if (isMainThread) {
    // Assume a CLI run.
    await CommandFactory.run(CliCommandsModule);
  } else {
    // This is VERY simplistic for now - if started as a worker, assume it's to
    // execute importers.  Run the importers, then when finished, exit.
    const app = await NestFactory.createApplicationContext(ImportWorkerModule);
    const logger = new Logger('worker-main');
    const songImporterManagerService = app.get<SongImporterManagerService>(
      SongImporterManagerService
    );
    await songImporterManagerService.runImporters();
    logger.log('Worker: Finished running importers. Shutting down worker.');
    await app.close();
  }
}
bootstrap();
