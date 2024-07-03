import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { MakesService } from './makes.service';
import { PaginatedMake } from './entities/make.entity';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Resolver((of) => PaginatedMake)
export class MakesResolver {
  constructor(private makesService: MakesService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => PaginatedMake)
  makes(
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ): Promise<PaginatedMake> {
    return this.makesService.getMakes(page, pageSize);
  }
}
