import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { KonsumenService } from './konsumen.service';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator'; //import disini
import { CreateKonsumenDto, findAllKonsumenDto } from './konsumen.dto';
import { JwtGuard } from 'src/app/auth/auth.guard';
import { Pagination } from 'src/utils/decorator/page.decorator';

@UseGuards(JwtGuard)
@Controller('konsumen')
export class KonsumenController {
  constructor(private konsumenService: KonsumenService) {}

  @Post('create')
  async create(@InjectCreatedBy() payload: CreateKonsumenDto) {
    return this.konsumenService.create(payload);
  }

  @Get('list')
  async findAll(@Pagination() query: findAllKonsumenDto) {
    return this.konsumenService.findAll(query);
  }
}
