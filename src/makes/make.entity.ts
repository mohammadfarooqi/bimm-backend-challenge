import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

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
}
