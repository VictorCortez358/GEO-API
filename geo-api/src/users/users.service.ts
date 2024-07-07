import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '.prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async createUser(user: CreateUserDto) {
    return this.prismaService.user.create({
        data: {
            ...user,
        }
    });
  }

  // This method is used to find a user by email
  async findOneUserByEmail(email: string): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: {
        email
      }
    });
  }

  // This method is used to update the password of a user
  async updatePassword(id: string, newPassword: string) {
    return this.prismaService.user.update({
        where: { id },
        data: { password: newPassword }
    });
  }

  // This metodo only can be used by the ADMIN
  async findAllUsers(role: string): Promise<User[]> {
      if (role !== 'ADMIN') {
        throw new Error('You are not authorized to perform this action');
      }
      const users = await this.prismaService.user.findMany();
      return users;
  }
  
  // This metodo only can be used by the ADMIN
  // In this method, it's used a raw query to get the user and its products because Prisma does not support geometry types yet.
  async findOneUser(id: string, role: string): Promise<User | null> {
    if (role !== 'ADMIN') {
      throw new Error('You are not authorized to perform this action');
    }
    return this.prismaService.$queryRaw<User[]>`
      SELECT 
        u.id, 
        u.email, 
        u.name, 
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
      FROM "User" u
      LEFT JOIN "Product" p ON u.id = p.user_id
      WHERE u.id = ${id}
      GROUP BY u.id
    `[0];
  }

    // This metodo only can be used by the ADMIN
    async deleteUser(id: string, role: string) {
      if (role !== 'ADMIN') {
        throw new Error('You are not authorized to perform this action');
      }
      return this.prismaService.user.delete({
        where: {
          id
        }
      });
    }

}
