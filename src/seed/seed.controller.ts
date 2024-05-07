import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators';
import { validRoles } from 'src/auth/interfaces';
import { ApiTags } from '@nestjs/swagger';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  @ApiTags('Seed')
  @Get()
  // @Auth(validRoles.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }

}
