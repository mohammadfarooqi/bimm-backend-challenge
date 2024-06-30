import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Make } from 'src/makes/entities/make.entity';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class VehicleType {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => Int)
  @PrimaryGeneratedColumn()
  id: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => Int, { name: 'typeId' })
  @Index({ unique: true })
  @Column()
  code: number;

  @Field({ name: 'typeName' })
  @Column()
  name: string;

  @ManyToMany(() => Make, (make) => make.vehicleTypes)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Field((type) => [Make])
  makes: Make[];
}
