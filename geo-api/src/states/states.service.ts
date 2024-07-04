import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { State } from '.prisma/client';

@Injectable()
export class StatesService {
  constructor(private prismaService:PrismaService) {}

  async findAllStates() {
    const states = await this.prismaService.$queryRaw<State[]>`
      SELECT
        s.id,
        s.name,
        json_agg(json_build_object(
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
        )) AS products
      FROM "State" s
      LEFT JOIN "Product" p ON s.id = p.state_id
      GROUP BY s.id
    `;

    return states;
  }

  async findOneState(id: number) {
    const state = await this.prismaService.$queryRaw`
      SELECT id, name FROM "State" WHERE id = ${id}
    `;
    return state[0];
  }
}
