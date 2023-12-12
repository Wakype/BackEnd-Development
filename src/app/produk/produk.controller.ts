import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import {
  CreateProdukArrayDto,
  CreateProdukDto,
  UpdateProdukDto,
  findAllProduk,
} from './produk.dto';
import { JwtGuard } from '../auth/auth.guard';
import { Pagination } from 'src/utils/decorator/page.decorator';
import { InjectCreatedBy } from 'src/utils/decorator/inject-created_by.decorator';
import { InjectUpdatedBy } from 'src/utils/decorator/inject-updated_by.decorator';

@UseGuards(JwtGuard)
@Controller('produk')
export class ProdukController {
  constructor(private produkService: ProdukService) {}

  @Post('create')
  async create(@InjectCreatedBy() payload: CreateProdukDto) {
    return this.produkService.create(payload);
  }

  @Post('create-bulk')
  async createBulk(@Body() payload: CreateProdukArrayDto) {
    return this.produkService.createBulk(payload);
  }

  @Get('list')
  async findAll(@Pagination() query: findAllProduk) {
    return this.produkService.findAll(query);
  }

  @Get('detail/:id')
  getBook(@Param('id') id: string) {
    return this.produkService.getDetail(+id);
  }

  @Put('update/:id')
  updateBook(
    @Param('id') id: string,
    @InjectUpdatedBy() payload: UpdateProdukDto,
  ) {
    return this.produkService.update(+id, payload);
  }

  @Delete('delete/:id')
  deleteBook(@Param('id') id: string) {
    return this.produkService.delete(+id);
  }
}
