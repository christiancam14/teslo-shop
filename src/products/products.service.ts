import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as IsUUID } from 'uuid';
import { isUUID } from 'class-validator';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {

    try {

      const product = this.productRepository.create(createProductDto)
      await this.productRepository.save(product)

      return product;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async createBulk(createProductsDto: CreateProductDto[]): Promise<Product[]> {
    try {

      let productsDB: Product[];

      createProductsDto.forEach(product => {
        async () => {
          const productDB = this.productRepository.create(product)
          await this.productRepository.save(productDB)
          productsDB.push(productDB);
        }

      });

      return productsDB;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll() {
    return await this.productRepository.find({});
  }

  async findPage(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto; 
    return await this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
    });
  }

  async findOne(term: string) {

    let product : Product;

    if( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id: term});
    } else {
      product = product = await this.productRepository.findOneBy({ slug: term});
    }


    // const product = await this.productRepository.findOneBy({ term });

    if (!product) {
      throw new NotFoundException(`Product with id ${term} not found`);
    }

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id);    
    await this.productRepository.remove(product);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505')
      throw new InternalServerErrorException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
