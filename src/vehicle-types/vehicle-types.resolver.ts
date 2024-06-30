import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { VehicleTypesService } from './vehicle-types.service';
import { VehicleType } from './entities/vehicle-type.entity';
// import { MakesService } from './makes.service';
// import { Make } from './entities/make.entity';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
@Resolver((of) => VehicleType)
export class VehicleTypesResolver {
  constructor(private vtService: VehicleTypesService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Query((returns) => [VehicleType])
  vehicleTypes(
    @Args('makeId', { type: () => Int }) makeId: number,
  ): Promise<VehicleType[]> {
    return this.vtService.findByMakeId(makeId);
  }
}
