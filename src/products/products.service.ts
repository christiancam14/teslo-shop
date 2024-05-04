import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as IsUUID } from 'uuid';
import { isUUID } from 'class-validator';
import { ProductImage } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSoruce: DataSource
  ) { }

  async create(createProductDto: CreateProductDto) {

    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      });

      await this.productRepository.save(product);

      return { ...product, images };

    } catch (error) {
      this.handleDBExceptions(error);
    }


  }

  async createBulk(createProductsDto: CreateProductDto[]): Promise<Product[]> {
    try {

      let productsDB: Product[];

      createProductsDto.forEach(product => {
        async () => {
          const productDB = this.productRepository.create({
            ...product,
            images: []
          })
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
    const products = await this.productRepository.find({
      relations: {
        images: true
      }
    });

    return products.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }));
  }

  async findPage(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });

    return products.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }));
  }

  async findOne(term: string) {

    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {

      const queryBuilder = this.productRepository.createQueryBuilder('prod');

      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product with id ${term} not found`);
    }

    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const { images, ...toUpdate} = updateProductDto;

    const product = await this.productRepository.preload({ id: id, ...toUpdate })

    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`);
    }

    // Crear query runner
    const queryRunner = this.dataSoruce.createQueryBuilder();

    try {

      await this.productRepository.save(product);
      return product;

    } catch (error) {

      this.handleDBExceptions(error);

    }

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
