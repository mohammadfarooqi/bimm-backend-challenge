import { Field, Int, ObjectType } from '@nestjs/graphql';
import { VehicleType } from 'src/vehicle-types/entities/vehicle-type.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Make {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => Int, { name: 'makeId' })
  @Index({ unique: true })
  @Column()
  code: number;

  @Field({ name: 'makeName' })
  @Column()
  name: string;

  @ManyToMany(() => VehicleType, (vehicleType) => vehicleType.makes)
  @JoinTable()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => [VehicleType], { nullable: true })
  vehicleTypes: VehicleType[];
}
