import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

// This service will be used to connect to the Prisma client
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }
}