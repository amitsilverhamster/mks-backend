import { Controller, Get, Post, Body, Patch, Param, Delete, Render } from '@nestjs/common';
import { PublicapiService } from './publicapi.service';
import { CreatePublicapiDto } from './dto/create-publicapi.dto';
import { UpdatePublicapiDto } from './dto/update-publicapi.dto';


@Controller('publicapi')
export class PublicapiController {
  constructor(private readonly publicapiService: PublicapiService) {}

  @Get('/products') // Render the Handlebars view
  async findAll() {
    const products = await this.publicapiService.findAllProducts();
    return { products };  // Pass the products array wrapped in an object
  }

  @Get('/attributes')
  async findAttributes() {
    return this.publicapiService.findAttributes();
  }
}
