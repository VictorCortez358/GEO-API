# API de NestJS con Prisma

## Instalación

```bash
npm install
```

Instala las dependencias necesarias con npm, yarn o tu gestor de paquetes favorito.

Asegúrate de tener instalado el CLI de NestJS y Prisma de forma global en tu sistema.

```bash
npm install -g @nestjs/cli
npm install -g prisma
```


## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto e incluye las siguientes variables: `DATABASE_URL` para la cadena de conexión a la base de datos y `JWT_SECRET` para la clave secreta del token JWT.

```bash
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombredb"
JWT_SECRET="secret"
```

## Base de Datos

Crea una base de datos en PostgreSQL y asegúrate de que la cadena de conexión en el archivo `.env` sea correcta.

## Generar una migración con Prisma


**Importante:** Asegúrate de que la base de datos esté vacía antes de ejecutar las migraciones y que tenga instalada la extensión PostGIS. Puedes instalar la extensión con el siguiente comando:

```sql
CREATE EXTENSION postgis;
```

Genera una migración con Prisma para crear el esquema de la base de datos. La migración se creará en la carpeta `prisma/migrations`. 

Puedes ejecutar el siguiente comando para generar una migración con el nombre `init`:

```bash
npx prisma migrate dev --name init
```


Cuando tengas la base de datos creada y la cadena de conexión configurada, modifica la columnas de tipo BYTEA a tipo Geometry en las tablas `City` y `Products` con el siguiente comando:

```sql
ALTER TABLE "City"
    ALTER COLUMN "geom" TYPE GEOMETRY
    USING ST_GeomFromWKB("geom"::BYTEA);;

ALTER TABLE "Products"
    ALTER COLUMN "geom" TYPE GEOMETRY
    USING ST_GeomFromWKB("geom"::BYTEA);;
```
Esto es necesario para que las columnas de tipo Geometry sean compatibles con PostGIS. y puedan almacenar datos geoespaciales. ya que Prisma no soporta el tipo de dato Geometry.

## Ejecutar la aplicación

```bash
# modo desarrollo
$ npm run start

# modo observación
$ npm run start:dev

# modo producción
$ npm run start:prod
```

## Pruebas

```bash
# pruebas unitarias
$ npm run test

# pruebas e2e
$ npm run test:e2e

# cobertura de pruebas
$ npm run test:cov
```

## Documentación

La documentación de la API se encuentra en la ruta `/api` y se puede acceder desde el navegador, por ejemplo: `http://localhost:3000/api`.


## Soporte

Nest es un proyecto de código abierto con licencia MIT. Puede crecer gracias a los patrocinadores y al respaldo de los increíbles patrocinadores. Si deseas unirte a ellos, por favor lee más aquí: https://docs.nestjs.com/support.

## Licencia

Nest tiene licencia MIT.
