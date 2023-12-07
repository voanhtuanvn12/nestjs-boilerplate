import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Level } from 'pino';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { HEADER } from './shared/constants/request';
import { LoggerModule } from 'nestjs-pino';
import { configurationFactory } from './shared/config/configuration-factory';

const loggerConfig = {
  // https://github.com/pinojs/pino-http
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      pinoHttp: {
        level: configService.get<Level>('logLvl'), // the logger level pino-http is using to log out the response. default: info

        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                },
              }
            : undefined,
        genReqId: function (req: any) {
          return req.headers[HEADER.X_REQUEST_ID];
        },

        serializers: {
          req(req: any) {
            const redactedReq = {
              id: req.id,
              method: req.method,
              url: req.url,
              query: req.query,
              params: req.param,
              headers: {} as Record<string, unknown>,
              remoteAddress: req.remoteAddress,
              remotePort: req.remotePort,
              body: {},
            };
            for (const header in req.headers) {
              if (HEADER.REDACTEDS.includes(header)) {
                redactedReq.headers[header] = HEADER.REDACTED_VALUE;
              } else {
                redactedReq.headers[header] = req.headers[header];
              }
            }
            const logLvl = configService.get<Level>('logLvl');
            if (logLvl === 'debug' || logLvl === 'trace') {
              redactedReq.body = req.raw.body;
            }
            return redactedReq;
          },
        },

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        customReceivedMessage: function (req: any, _res: any) {
          return 'Request received: ' + req.headers[HEADER.X_REQUEST_ID];
        },

        customSuccessMessage: function (res: any) {
          return 'Request completed: ' + res.req.headers[HEADER.X_REQUEST_ID];
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        customErrorMessage: function (_error: any, res: any) {
          return 'Request errored: ' + res.req.headers[HEADER.X_REQUEST_ID];
        },
      },
    };
  },
};

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configurationFactory], // TODO do config validation based on expected schema
    }),
    LoggerModule.forRootAsync(loggerConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
