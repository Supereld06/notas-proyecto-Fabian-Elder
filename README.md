# Notas API - Rama mejoras-pruebas-unitarias

API RESTful de notas para el taller de Programacion Backend Moderna. Esta rama se enfoca en mejorar y verificar las pruebas unitarias, especialmente el Happy Path de `CategoryService`.

Importante: esta rama trabaja con MongoDB para las entidades del proyecto. No corresponde a la rama donde se hicieron pruebas con MySQL.

## Rama actual

```text
mejoras-pruebas-unitarias
```

## Tecnologias principales

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- Jest
- Supertest para pruebas de integracion existentes

## Arquitectura

El proyecto mantiene una separacion por capas:

```text
Route -> Middleware -> Controller -> Service / Use Case -> Repository -> Model / Database
```

Ejemplo para categorias:

```text
category.routes.js
-> CategoryController
-> CategoryService
-> CategoryRepository
-> CategoryModel / MongoDB
```

## Instalacion

Desde la carpeta del proyecto:

```powershell
npm.cmd install
```

En PowerShell se recomienda usar `npm.cmd` si `npm` queda bloqueado por politicas de ejecucion.

## Variables de entorno

Crear o completar el archivo `.env` usando `.envExample` como referencia.

Ejemplo sin credenciales reales:

```env
PORT=3000
JWT_SECRET=CLAVE_CONALMENOS26BITS
MONGO_URI=tu_uri_de_mongodb

MAIL_HOST=
MAIL_PORT=
MAIL_SECURE=false
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
```

Notas:

- `MONGO_URI` debe apuntar a tu base de datos MongoDB o MongoDB Atlas.
- Si usas MongoDB Atlas, tu IP debe estar permitida en Network Access.
- Los datos de MySQL que aparecen en `.envExample` no son necesarios para levantar esta rama con MongoDB.

## Levantar el proyecto

Comando recomendado:

```powershell
node src\app.js
```

Tambien existe script de desarrollo:

```powershell
npm.cmd run dev
```

Si `nodemon` falla por permisos del entorno, usar `node src\app.js`.

## Verificar que la API esta funcionando

Healthcheck:

```text
GET http://localhost:3000/api/health
```

Respuesta esperada:

```json
{
  "status": "OK",
  "message": "API de notas activa"
}
```

Swagger:

```text
http://localhost:3000/api-docs
```

## Autenticacion

Registrar usuario:

```http
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json
```

Body:

```json
{
  "name": "Usuario Test",
  "email": "test@example.com",
  "password": "Test12345",
  "role": "user"
}
```

Login:

```http
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json
```

Body:

```json
{
  "email": "test@example.com",
  "password": "Test12345"
}
```

La respuesta devuelve un token JWT que se usa en rutas protegidas:

```http
Authorization: Bearer <token>
```

## Categorias con MongoDB

Crear categoria:

```http
POST http://localhost:3000/api/v1/categories
Authorization: Bearer <token>
Content-Type: application/json
```

Body:

```json
{
  "name": "Ideas"
}
```

La categoria se asocia al usuario autenticado mediante `req.user.id`.

Archivos relacionados:

```text
src/domain/entities/category.entity.js
src/application/use-cases/category.service.js
src/presentation/controllers/category.controller.js
src/presentation/routes/category.routes.js
src/infrastructure/database/mongo/category.model.js
src/infrastructure/database/mongo/category.mongo.repository.js
```

## Notas con MongoDB

Crear nota sin categoria:

```http
POST http://localhost:3000/api/v1/notes
Authorization: Bearer <token>
Content-Type: application/json
```

Body:

```json
{
  "title": "Nota sin categoria",
  "content": "Contenido de prueba"
}
```

Crear nota con categoria:

```http
POST http://localhost:3000/api/v1/notes
Authorization: Bearer <token>
Content-Type: application/json
```

Body:

```json
{
  "title": "Nota con categoria",
  "content": "Contenido de prueba",
  "categoryId": "id_de_categoria_mongodb"
}
```

En esta rama, `categoryId` corresponde a un ObjectId de MongoDB.

## Ruta publica de notas

Endpoint publico:

```text
GET /api/v1/notes/:id/public
```

No requiere token JWT.

Comportamiento esperado:

- Si la nota no existe, responde `404`.
- Si la nota existe y `isPrivate` es `true`, responde `403`.
- Si la nota existe y `isPrivate` es `false`, responde `200` y devuelve la nota.

Ejemplo:

```http
GET http://localhost:3000/api/v1/notes/<id>/public
```

## Pruebas

Esta rama mejora la prueba unitaria de `CategoryService`.

Archivo principal:

```text
src/test/category.service.test.js
```

La prueba:

- Usa Jest.
- Prueba solo `CategoryService`.
- Usa un mock del repositorio.
- No conecta MongoDB real.
- No levanta Express.
- No usa Supertest.
- Sigue `Arrange -> Act -> Assert`.
- Valida `name` y `userId`.
- Verifica que `repository.create` se llama con los datos correctos.

Ejecutar solo la prueba de CategoryService:

```powershell
npm.cmd test -- src/test/category.service.test.js --runInBand
```

Ejecutar toda la suite:

```powershell
npm.cmd test -- --runInBand
```

Resultado esperado:

```text
Test Suites: 4 passed, 4 total
Tests: 10 passed, 10 total
```

## Notas para pruebas

El script de test usa `NODE_ENV=test` para evitar levantar el servidor real o conectar MongoDB real al importar `app.js` en pruebas.

```json
{
  "test": "cross-env NODE_ENV=test node --experimental-vm-modules node_modules/jest/bin/jest.js"
}
```

Esto permite que las pruebas unitarias se mantengan rapidas y aisladas.

## Comandos utiles

Ver rama actual:

```powershell
git branch --show-current
```

Ver estado:

```powershell
git status --short
```

Ejecutar servidor:

```powershell
node src\app.js
```

Ejecutar pruebas:

```powershell
npm.cmd test -- --runInBand
```
