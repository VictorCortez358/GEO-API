import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CitiesService {

  constructor(private prismaService: PrismaService) {}

  // Remove the geom field from the select object because it is not needed in this method. 
  // and the geom column is very large and it is not necessary to return it in this case.
  async findAll() {
    const cities = await this.prismaService.city.findMany({
      select: {
        id: true,
        name: true,
        geom: false,
      },
    });
    return cities;
  }

  // Use a raw query to get the city and its geometry because Prisma does not support geometry types yet.
  // We are using the ST_AsText function to convert the geom column to a string.
  async findOne(id: string) {
    const city = await this.prismaService.$queryRaw`
      SELECT id, name, ST_AsText(geom) as geom FROM "City" WHERE id = ${id}
    `;

    return city;
  }
}
