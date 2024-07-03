import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MakesResolver } from './makes/makes.resolver';
import { MakesService } from './makes/makes.service';
import { Make } from './makes/entities/make.entity';
import { HttpModule } from '@nestjs/axios';
import { MakesApiService } from './makes/makes-api/makes-api.service';
import { VehicleTypesService } from './vehicle-types/vehicle-types.service';
import { VehicleTypesResolver } from './vehicle-types/vehicle-types.resolver';
import { VehicleTypesApiService } from './vehicle-types/vehicle-types-api/vehicle-types-api.service';
import { VehicleType } from './vehicle-types/entities/vehicle-type.entity';
import { BullMqModule, RegisterQueues } from './bullMQ/bullMQ.config';

import { BatchProcessor } from './bullMQ/processors/batch.processor';
import { MakeEventListner } from './bullMQ/event-listener/vehicleType.eventsListener';
import { BatchEventListner } from './bullMQ/event-listener/batch.eventsListener';
import { QueueService } from './bullMQ/queue.service';
import { VehicleTypeProcessor } from './bullMQ/processors/vehicleType.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        playground: configService.get<string>('node_env') != 'production',
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
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
    TypeOrmModule.forFeature([Make, VehicleType]),
    HttpModule,
    BullMqModule,
    RegisterQueues,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MakesResolver,
    MakesService,
    MakesApiService,
    VehicleTypesService,
    VehicleTypesResolver,
    VehicleTypesApiService,
    QueueService,

    VehicleTypeProcessor,
    BatchProcessor,
    MakeEventListner,
    BatchEventListner,
  ],
})
export class AppModule {}
