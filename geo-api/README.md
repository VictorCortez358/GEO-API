
# Documentación de la API de NestJS con Prisma

## Instalación

Para comenzar, instala las dependencias necesarias utilizando npm, yarn o tu gestor de paquetes favorito:

```bash
npm install
```

Asegúrate de tener instalado el CLI de NestJS y Prisma globalmente en tu sistema:

```bash
npm install -g @nestjs/cli
npm install -g prisma
```

## Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto e incluye las siguientes variables:

- `DATABASE_URL`: Cadena de conexión a la base de datos.
- `JWT_SECRET`: Clave secreta para el token JWT.

Ejemplo de archivo `.env`:

```plaintext
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombredb"
JWT_SECRET="secret"
```

## Base de Datos

Crea una base de datos en PostgreSQL y asegúrate de que la cadena de conexión en el archivo `.env` sea correcta.

## Generar una Migración con Prisma

**Nota:** Asegúrate de que la base de datos esté vacía antes de ejecutar las migraciones y que tenga instalada la extensión PostGIS. Puedes instalar la extensión con el siguiente comando:

```sql
CREATE EXTENSION postgis;
```

Para generar una migración con Prisma y crear el esquema de la base de datos, ejecuta el siguiente comando:

```bash
npx prisma migrate dev --name init
```

Una vez que la base de datos esté creada y la cadena de conexión configurada, modifica las columnas de tipo BYTEA a tipo Geometry en las tablas `City` y `Products` con el siguiente comando:

```sql
ALTER TABLE "City"
    ALTER COLUMN "geom" TYPE GEOMETRY
    USING ST_GeomFromWKB("geom"::BYTEA);

ALTER TABLE "Products"
    ALTER COLUMN "geom" TYPE GEOMETRY
    USING ST_GeomFromWKB("geom"::BYTEA);
```

Esto es necesario para que las columnas de tipo Geometry sean compatibles con PostGIS y puedan almacenar datos geoespaciales, ya que Prisma no soporta el tipo de dato Geometry.

**Nota:** Para generar los datos de la tabla `City` se utilizó la base de datos `el_salvador_wgs84.gpkg`, ubicada en la carpeta data del proyecto. Para importar estos datos a la base de datos, se utilizó la herramienta `QGIS`, exportando los datos a la base de datos para añadir la información de la tabla City.

El siguiente enlace muestra cómo se realizó la importación de los datos a la base de datos ademas de otros comandos utiles para generar datos de prueba en la base de datos.

[Enlace a la documentación de la importación de datos a la base de datos](https://drive.google.com/file/d/1WcuW9p-LSzdUMwzfDDEtGAXWCpetVv6Q/view?usp=drive_link)

## Ejecutar la Aplicación

Para iniciar la aplicación, puedes utilizar los siguientes comandos según el modo deseado:

```bash
# Modo desarrollo
npm run start

# Modo observación (hot-reload)
npm run start:dev

# Modo producción
npm run start:prod
```

## Pruebas

Ejecuta las pruebas utilizando los siguientes comandos:

```bash
# Pruebas unitarias
npm run test

# Pruebas de extremo a extremo (e2e)
npm run test:e2e

# Cobertura de pruebas
npm run test:cov
```

## Documentación de la API

La documentación de la API se encuentra disponible en la ruta `/api` y se puede acceder desde el navegador, por ejemplo: `http://localhost:3000/api`.

## Soporte

Nest es un proyecto de código abierto con licencia MIT. Puede crecer gracias a los patrocinadores y al respaldo de la comunidad. Si deseas unirte a ellos, por favor, consulta más información en: [NestJS Soporte](https://docs.nestjs.com/support).

## Licencia

Nest está licenciado bajo la licencia MIT.
