import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseResponse from 'src/utils/response/base.response';
import { Kategori } from './kategori.entity';
import {
  CreateKategoriDto,
  UpdateKategoriDto,
  createKategoriArrayDto,
  findAllKategori,
} from './kategori.dto';
import { ResponsePagination, ResponseSuccess } from 'src/interface/response';
import { Like, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class KategoriService extends BaseResponse {
  constructor(
    @InjectRepository(Kategori)
    private readonly kategoriRepository: Repository<Kategori>,
    @Inject(REQUEST) private req: any, // inject request agar bisa mengakses req.user.id dari  JWT token pada service
  ) {
    super();
  }

  async create(payload: CreateKategoriDto): Promise<ResponseSuccess> {
    try {
      await this.kategoriRepository.save(payload);

      return this._success('OK', {
        user_id: this.req.user.id,
        payload,
      });
    } catch {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  // async createBulk(payload: CreateKategoriDto[]): Promise<ResponseSuccess> {
  //   console.log(payload);
  //   try {
  //     const kategoris = payload.map((kategoriDto) => ({
  //       ...kategoriDto,
  //       created_by: { id: this.req.user.id },
  //     }));

  //     await this.kategoriRepository.save(kategoris);

  //     return this._success('Bulk create successful', payload);
  //   } catch (error) {
  //     throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
  //   }
  // }

  async bulkCreate(payload: createKategoriArrayDto): Promise<ResponseSuccess> {
    console.log(payload);

    try {
      const results = await Promise.all(
        payload.data.map(async (kategoriDto) => {
          try {
            // Set the 'created_by' field
            kategoriDto.created_by = { id: this.req.user.id };

            await this.kategoriRepository.save(kategoriDto);
            return 'success';
          } catch (error) {
            return 'failed';
          }
        }),
      );

      const berhasil = results.filter((result) => result === 'success').length;
      const gagal = results.filter((result) => result === 'failed').length;

      return this._success(
        `Berhasil menyimpan ${berhasil} dan gagal ${gagal}`,
        payload,
      );
    } catch (error) {
      throw new HttpException('Ada Kesalahan', HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  // async bulkCreate(payload: createKategoriArrayDto): Promise<ResponseSuccess> {
  //   try {
  //     let berhasil = 0;
  //     let gagal = 0;

  //     await Promise.all(
  //       payload.data.map(async (data) => {
  //         try {
  //           await this.kategoriRepository.save(data);

  //           berhasil += 1;
  //         } catch {
  //           gagal += 1;
  //         }
  //       }),
  //     );

  //     return this._success(
  //       `Berhasil menyimpan ${berhasil} dan gagal ${gagal}`,
  //       payload,
  //     );
  //   } catch {
  //     throw new HttpException('Ada Kesalahan', HttpStatus.BAD_REQUEST);
  //   }
  // }

  async getAllCategory(query: findAllKategori): Promise<ResponsePagination> {
    const { page, pageSize, limit, nama_kategori } = query;

    // const filterQuery = {};
    const filterQuery: {
      [key: string]: any;
    } = {};

    if (nama_kategori) {
      filterQuery.nama_kategori = Like(`%${nama_kategori}%`);
    }
    const total = await this.kategoriRepository.count({
      where: filterQuery,
    });
    const result = await this.kategoriRepository.find({
      where: filterQuery,
      relations: ['created_by', 'updated_by'], // relasi yang aka ditampilkan saat menampilkan list kategori
      select: {
        // pilih data mana saja yang akan ditampilkan dari tabel kategori
        id: true,
        nama_kategori: true,
        created_by: {
          id: true, // pilih field  yang akan ditampilkan dari tabel user
          nama: true,
        },
        updated_by: {
          id: true, // pilih field yang akan ditampilkan dari tabel user
          nama: true,
        },
      },
      skip: limit,
      take: pageSize,
    });

    return this._pagination('OK', result, total, page, pageSize);
  }

  async getDetailKategori(id: number): Promise<ResponseSuccess> {
    try {
      const detail = await this.kategoriRepository.findOne({
        where: {
          id,
        },
      });

      console.log(detail);

      if (detail === null) {
        throw new NotFoundException(
          `Kategori dengan ID: ${id}. Tidak ditemukan`,
        );
      }

      return this._success('Detail Kategori ditemukan', detail);
    } catch (err) {
      return err;
    }
  }

  async updateKategori(
    id: number,
    UpdateKategoriDto: UpdateKategoriDto,
  ): Promise<ResponseSuccess> {
    const check = await this.kategoriRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Kategori dengan ID ${id}. Tidak ditemukan`);

    const update = await this.kategoriRepository.save({
      ...UpdateKategoriDto,
      id: id,
    });
    return this._success('Kategori berhasil diupdate', update);
  }

  async deleteKategori(id: number): Promise<ResponseSuccess> {
    const check = await this.kategoriRepository.findOne({
      where: {
        id,
      },
    });

    if (!check)
      throw new NotFoundException(`Kategori dengan id ${id} tidak ditemukan`);
    await this.kategoriRepository.delete(id);
    return this._success('Kategori berhasil dihapus');
  }
}
