import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from '.prisma/client';

@Injectable()
export class CategoriesService {
  
  constructor(private prismaService: PrismaService) {}

  async findAllCategories() {
    return await this.prismaService.category.findMany();
  }

  async findOneCategory(id: number) {
    const category = await this.prismaService.$queryRaw`
      SELECT 
        c.id, 
        c.name,
        json_agg(
          json_build_object(
            'id', p.id,
            'category_id', p.category_id,
            'city_id', p.city_id,
            'state_id', p.state_id,
            'user_id', p.user_id,
            'description', p.description,
            'price', p.price,
            'image_url', p.image_url,
            'sale_point', ST_AsText(p.sale_point),
            'sale_radius', p.sale_radius
          )
        ) AS products
      FROM "Category" c
      LEFT JOIN "Product" p ON c.id = p.category_id
      WHERE c.id = ${id}
      GROUP BY c.id;
    `;
  
    return category[0];
  }
}
