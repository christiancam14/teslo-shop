import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post('/bulk')
  createBulk(@Body() CreateProductsDto: CreateProductDto[]) {
    return this.productsService.createBulk(CreateProductsDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get('page')
  findPage(@Query() paginationDto: PaginationDto) {
    return this.productsService.findPage(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string ) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}