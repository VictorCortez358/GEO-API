import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiBody, ApiQuery, ApiConsumes } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from './utils/multer.config';
import { ConvertedProductDto } from './dto/converterd-product.dto';


@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  // In this endpoint, use a interceptor to upload the image of the product.
  @Post('/addProduct')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateProductDto,
    schema: {
      type: 'object',
      properties: {
        category_id: { type: 'string' },
        city_id: { type: 'string' },
        state_id: { type: 'string' },
        description: { type: 'string' },
        name: { type: 'string' },
        price: { type: 'string' },
        sale_radius: { type: 'string' },
        lat: { type: 'string' },
        long: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente.' })
  @ApiResponse({ status: 403, description: 'Prohibido.' })
  @UseInterceptors(FileInterceptor('image_url', { storage }))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req
  ) {
    const userId = req.user.sub;
    const imagePath = file.path;

    // Convertir campos a sus tipos correspondientes
    const convertedProductDto: ConvertedProductDto = {
      category_id: parseInt(createProductDto.category_id, 10),
      city_id: createProductDto.city_id,  // UUID remains a string
      state_id: parseInt(createProductDto.state_id, 10),
      description: createProductDto.description,
      name: createProductDto.name,
      price: parseFloat(createProductDto.price),
      sale_radius: parseInt(createProductDto.sale_radius, 10),
      lat: parseFloat(createProductDto.lat),
      long: parseFloat(createProductDto.long),
    };

    return this.productsService.createProduct(convertedProductDto, userId, imagePath);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener lista de productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos devuelta exitosamente.' })
  @ApiResponse({ status: 403, description: 'Prohibido.' })
  findAll() {
    return this.productsService.findAllProducts();
  }

  @UseGuards(AuthGuard)
  @Get('/id/:id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: String })
  @ApiResponse({ status: 200, description: 'Producto devuelto exitosamente.' })
  @ApiResponse({ status: 403, description: 'Prohibido.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOneProduct(id);
  }

  @UseGuards(AuthGuard)
  @Delete('/id/:id')
  @ApiOperation({ summary: 'Eliminar un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto', type: String })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente.' })
  @ApiResponse({ status: 403, description: 'Prohibido.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  remove(@Param('id') id: string, @Req() req) {
    const role = req.user.role;
    return this.productsService.deleteProduct(id, role);
  }

  @UseGuards(AuthGuard)
  @Get('/findProductInRadius')
  @ApiOperation({ summary: 'Buscar productos en un radio' })
  @ApiQuery({ name: 'lat', description: 'Latitud', type: Number })
  @ApiQuery({ name: 'long', description: 'Longitud', type: Number })
  @ApiQuery({ name: 'radius', description: 'Radio', type: Number })
  @ApiResponse({ status: 200, description: 'Productos encontrados en el radio especificado.' })
  @ApiResponse({ status: 403, description: 'Prohibido.' })
  findProductInRadius(
    @Query('lat') lat: number,
    @Query('long') long: number,
    @Query('radius') radius: number,
  ) {
    return this.productsService.findProductInRadius(lat, long, radius);
  }

  @UseGuards(AuthGuard)
  @Get('/findProductInRadiusByCategoriaAndName')
  @ApiOperation({ summary: 'Buscar productos en un radio por categoría y nombre' })
  @ApiQuery({ name: 'lat', description: 'Latitud', type: Number })
  @ApiQuery({ name: 'long', description: 'Longitud', type: Number })
  @ApiQuery({ name: 'radius', description: 'Radio', type: Number })
  @ApiQuery({ name: 'category_id', description: 'ID de la categoría', type: String })
  @ApiQuery({ name: 'name', description: 'Nombre del producto', type: String })
  @ApiResponse({ status: 200, description: 'Productos encontrados en el radio especificado por categoría y nombre.' })
  @ApiResponse({ status: 403, description: 'Prohibido.' })
  findProductInRadiusByCategoriaAndName(
    @Query('lat') lat: number,
    @Query('long') long: number,
    @Query('radius') radius: number,
    @Query('category_id') category_id: string,
    @Query('name') name: string,
  ) {

    return this.productsService.findProductInRadiusByCategoriaAndName(
      lat,
      long,
      radius,
      category_id,
      name,
    );
  }
}
