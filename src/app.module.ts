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
        playground: configService.get('node_env') != 'production', // TODO: make it dynamic based on node_env
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [NestConfigService],
      useFactory: (configService: NestConfigService) => ({
        type: 'postgres',
        host: configService.get('db.host'),
        port: configService.get('db.port'),
        username: configService.get('db.username'),
        password: configService.get('db.password'),
        database: configService.get('db.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // TODO: not use syncronize in prod, setup migrations instead
        ssl: true,
      }),
    }),
    TypeOrmModule.forFeature([Make]),
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, MakesResolver, MakesService],
})
export class AppModule {}
