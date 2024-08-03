import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { ConvertedProductDto } from './dto/converterd-product.dto';

@Injectable()
export class ProductsService {

  constructor(private prismaService: PrismaService) {}

  // In this method, it's used a raw query to create a product because Prisma does not support geometry types yet.
  async createProduct(createProductDto: ConvertedProductDto, userId: string, imagePath: string) {
    const { category_id, city_id, state_id, name, description, price, sale_radius, lat, long } = createProductDto;
    // Create a point with the lat and long provided by the user.
    const point = `POINT(${long} ${lat})`;
    const id = uuidv4();

    // Use ST_GeomFromText Function and pass the point and the SRID 4326 to create a geometry point.
    const newProduct = await this.prismaService.$executeRaw`
      INSERT INTO "Product" (id, category_id, city_id, state_id, user_id, name, description, price, image_url, sale_point, sale_radius)
      VALUES (${id}, ${category_id}, ${city_id}, ${state_id}, ${userId}, ${name}, ${description}, ${price}, ${imagePath}, ST_GeomFromText(${point}, 4326), ${sale_radius})
    `;

    if (!newProduct) {
      throw new Error('Error creating product');
    } else {
      return "Product created successfully";
    }
  }
  
  async findAllProducts() {
    const products = await this.prismaService.$queryRaw`
      SELECT id, category_id, city_id, name, state_id, user_id, description, price, image_url, ST_AsText(sale_point), sale_radius FROM "Product"
    `;
    return products;
  }

  // In this method, it's used a raw query to get the product and its geometry because Prisma does not support geometry types yet.
  async findOneProduct(id: string) {
    const product = await this.prismaService.$queryRaw`
      SELECT id, category_id, city_id, name, state_id, user_id, description, price, image_url, ST_AsText(sale_point), sale_radius FROM "Product" WHERE id = ${id}
    `;
    return product[0];
  }

  // In this method, it's used a raw query to get the product and its geometry because Prisma does not support geometry types yet.
  async findProductInRadius(lat: number, long: number, radius: number) {
    // Create a point with the lat and long provided by the user.
    const point = `POINT(${long} ${lat})`;
    // Convert the radius in meters to degrees.
    const radiusInDegrees = radius / 111320; 
    
    // Use ST_DWithin function to get the products in the radius provided by the user.
    // ST_DWithin function returns true if the distance between the two geometries is less than or equal to the distance provided.
    // And use ST_SetSRID to set the SRID of the point to 4326.
    const products = await this.prismaService.$queryRaw<Product[]>`
      SELECT id, category_id, name, city_id, state_id, user_id, description, price, image_url, ST_AsText(sale_point) AS sale_point, sale_radius
      FROM "Product"
      WHERE ST_DWithin(
        sale_point, 
        ST_SetSRID(ST_GeomFromText(${point}), 4326), 
        ${radiusInDegrees}
      )
    `;
  
    if (!products.length) {
      return "No hay productos en el radio proporcionado";
    }
    else {
      return products;
    }
  }
  
  

  async findProductInRadiusByCategoriaAndName(lat: number, long: number, radius: number, category_id?: string, name?: string) {
    const point = `POINT(${long} ${lat})`;
    // Convert the radius in meters to degrees.
    const radiusInDegrees = radius / 111320; 
    const like_name = `%${name}%`

    // In this case we are using a Prisma.sql template literal to create the query. because we need to 
    // add conditions to the query based on the parameters provided by the user.

    // Equivalent to findProductInRadius method used a ST_DWithin function to get the products in the radius provided by the user.
    // and use ST_SetSRID to set the SRID of the point to 4326.
    let query = Prisma.sql`
      SELECT id, category_id, city_id, state_id, name, user_id, name, description, price, image_url, ST_AsText(sale_point) AS sale_point, sale_radius
      FROM "Product"
      WHERE ST_DWithin(
        sale_point, 
        ST_SetSRID(ST_GeomFromText(${point}), 4326), 
        ${radiusInDegrees}
      )
    `;


    if (category_id !== undefined) {
        const category_id_number = parseInt(category_id);
        query = Prisma.sql`${query} AND category_id = ${category_id_number}`;
    }
    if (name !== undefined) {
        query = Prisma.sql`${query} AND name like ${like_name}`;
    }

    const products = await this.prismaService.$queryRaw<Product[]>(query);
  
    if (!products.length) {
      return [];
    } else {
      return products;
    }
  }

  // This metodo only can be used by the ADMIN
  async deleteProduct(id: string, role: string) {
    if (role !== 'ADMIN') {
      throw new Error('You are not authorized to perform this action');
    }
    
    return this.prismaService.$queryRaw`
      DELETE FROM "Product" WHERE id = ${id}
    `;
  }
}
