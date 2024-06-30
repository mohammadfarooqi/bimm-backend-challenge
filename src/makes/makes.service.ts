import { Injectable } from '@nestjs/common';
import { Make } from './make.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MakesService {
  constructor(
    @InjectRepository(Make) private makesRepository: Repository<Make>,
  ) {}

  async findAll(): Promise<Make[]> {
    return this.makesRepository.find();
  }

  create(make: Make): Promise<Make> {
    const newMake = this.makesRepository.create(make);
    return this.makesRepository.save(newMake);
  }
}
