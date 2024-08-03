import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateProductDto {
    @ApiProperty({
        description: 'Identificador de la categoría del producto',
        example: '1'
    })
    @IsString()
    @IsNotEmpty()
    category_id: string;

    @ApiProperty({
        description: 'Identificador de la ciudad del producto',
        example: '0c115360-1aeb-4f23-b45b-978951192339'
    })
    @IsString()
    @IsNotEmpty()
    city_id: string;

    @ApiProperty({
        description: 'Identificador del estado del producto',
        example: '1'
    })
    @IsString()
    @IsNotEmpty()
    state_id: string;

    @ApiProperty({
        description: 'Descripción del producto',
        example: 'Descripción del producto'
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'Nombre del producto',
        example: 'Producto 1'
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Precio del producto',
        example: '100.00'
    })
    @IsString()
    @IsNotEmpty()
    price: string;

    @ApiProperty({
        description: 'Radio de venta del producto',
        example: '10.00'
    })
    @IsString()
    @IsNotEmpty()
    sale_radius: string;

    @ApiProperty({
        description: 'Coordenada de latitud',
        example: '13.676219992024572'
    })
    @IsString()
    @IsNotEmpty()
    lat: string;

    @ApiProperty({
        description: 'Coordenada de longitud',
        example: '-89.29670251019563'
    })
    @IsString()
    @IsNotEmpty()
    long: string;

    @ApiProperty({
        description: 'Imagen del producto',
        type: 'string',
        format: 'binary'
    })
    image_url: any;
}
