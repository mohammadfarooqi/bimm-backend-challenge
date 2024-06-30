import { Query, Resolver } from '@nestjs/graphql';
import { MakesService } from './makes.service';
import { Make } from './entities/make.entity';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Resolver((of) => Make)
export class MakesResolver {
  constructor(private makesService: MakesService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => [Make])
  makes(): Promise<Make[]> {
    console.log('test');
    return this.makesService.findAll();
  }
}
