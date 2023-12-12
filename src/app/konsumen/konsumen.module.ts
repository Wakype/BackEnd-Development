import { Module } from '@nestjs/common';
import { KonsumenController } from './konsumen.controller';
import { KonsumenService } from './konsumen.service';
import { Konsumen } from './konsumen.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Konsumen])],
  controllers: [KonsumenController],
  providers: [KonsumenService],
})
export class KonsumenModule {}
