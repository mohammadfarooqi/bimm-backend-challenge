import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  ConfigModule,
  ConfigService as NestConfigService,
} from '@nestjs/config';
import { ConfigService } from './config/config.service';
import configuration from './config/configuration';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MakesResolver } from './makes/makes.resolver';
import { MakesService } from './makes/makes.service';
import { Make } from './makes/make.entity';
import { HttpModule } from '@nestjs/axios';
import { MakesApiService } from './makes/makes-api/makes-api.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [NestConfigService],
      useFactory: (configService: NestConfigService) => ({
        playground: configService.get<string>('node_env') != 'production',
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [NestConfigService],
      useFactory: (configService: NestConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.username'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('node_env') != 'production',
        ssl: configService.get<boolean>('db.ssl'),
      }),
    }),
    TypeOrmModule.forFeature([Make]),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    MakesResolver,
    MakesService,
    MakesApiService,
  ],
})
export class AppModule {}
