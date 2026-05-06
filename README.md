# Notas API - Taller Clase 8

API RESTful para gestion de notas, autenticacion JWT, categorias y pruebas de servicios. El proyecto sigue una estructura por capas inspirada en Clean Architecture:

```text
Route -> Middleware -> Controller -> Service / Use Case -> Repository -> Model / Database
```

## Rama de trabajo

Los cambios del taller con mysql y mongo se encuentra en esta rama:

```text
mysql-y-mongo
```

En esta rama se mantiene MongoDB para usuarios/autenticacion y se habilita MySQL con Sequelize para notas y categorias.

## Configuracion general

Instalar dependencias:

```powershell
npm.cmd install
```

Variables necesarias en `.env`:

```env
PORT=3000
JWT_SECRET=tu_clave_jwt
MONGO_URI=tu_uri_de_mongodb
USE_MYSQL=true
MYSQL_HOST=localhost
MYSQL_USER=tu_usuario
MYSQL_PASSWORD=tu_password
MYSQL_DATABASE=Notas_Final_db

MAIL_HOST=
MAIL_PORT=
MAIL_SECURE=false
MAIL_USER=
MAIL_PASS=
MAIL_FROM=
```

Levantar el proyecto:

```powershell
node src\app.js
```

Endpoint de salud:

```text
GET http://localhost:3000/api/health
```

Documentacion Swagger:

```text
http://localhost:3000/api-docs
```

## Ejercicio 1 - Entidad Categorias

Se creo la entidad `Category` para que los usuarios puedan organizar sus notas por categorias, por ejemplo `Ideas` o `Tareas`.

Se implemento el flujo completo:

```text
category.routes.js
-> CategoryController
-> CategoryService
-> CategoryRepository
-> CategoryModel / MySQL
```

Archivos principales:

```text
src/domain/entities/category.entity.js
src/application/use-cases/category.service.js
src/presentation/controllers/category.controller.js
src/presentation/routes/category.routes.js
src/infrastructure/database/mysql/category.mysql.repository.js
src/app.js
```

Endpoint principal:

```text
POST /api/v1/categories
```

Caracteristicas implementadas:

- La ruta exige JWT mediante `authMiddleware`.
- El `userId` se obtiene desde `req.user.id`.
- `CategoryService` valida que exista `name`.
- `CategoryService` valida que exista `userId`.
- La categoria se guarda en MySQL en la tabla `categories`.
- La respuesta de creacion usa `201 Created`.

Ejemplo en Postman:

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

Verificacion en MySQL:

```sql
USE Notas_Final_db;
SELECT id, name, userId, createdAt, updatedAt FROM categories;
```

## Ejercicio 2 - Relacion de Notas con Categorias

Se extendio la entidad `Note` para aceptar un `categoryId` opcional.

Archivos principales:

```text
src/domain/entities/note.entity.js
src/application/use-cases/note.service.js
src/infrastructure/database/mysql/note.mysql.repository.js
src/presentation/controllers/note.controller.js
src/presentation/routes/note.routes.js
```

Caracteristicas implementadas:

- `NoteEntity` acepta `categoryId`.
- `createNote` permite crear notas con o sin `categoryId`.
- `updateNote` permite modificar `categoryId`.
- El modelo MySQL de notas tiene `categoryId` nullable.
- La tabla `notes` persiste correctamente el campo `categoryId`.
- Se mantiene compatibilidad con notas antiguas sin categoria.

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
  "categoryId": 1
}
```

Verificacion en MySQL:

```sql
USE Notas_Final_db;
DESCRIBE notes;
SELECT id, title, content, userId, categoryId FROM notes;
```

## Ejercicio 3 - Ruta Publica para Notas

Se agrego una ruta publica para consultar una nota compartible sin enviar token JWT.

Endpoint:

```text
GET /api/v1/notes/:id/public
```

Archivo principal:

```text
src/presentation/routes/note.routes.js
src/presentation/controllers/note.controller.js
src/application/use-cases/note.service.js
src/infrastructure/database/mysql/note.mysql.repository.js
```

Caracteristicas implementadas:

- La ruta publica no usa `authMiddleware`.
- Permite consultar una nota sin `Authorization Bearer Token`.
- Si la nota no existe, responde `404 Not Found`.
- Si la nota existe pero tiene `isPrivate: true`, responde `403 Forbidden`.
- Si la nota existe y `isPrivate: false`, responde `200 OK` y devuelve la nota.
- Las rutas protegidas de notas siguen usando JWT.

Prueba de nota publica:

```http
GET http://localhost:3000/api/v1/notes/1/public
Authorization: sin token
```

Prueba de nota inexistente:

```http
GET http://localhost:3000/api/v1/notes/999999/public
Authorization: sin token
```

Verificacion en MySQL:

```sql
USE Notas_Final_db;
SELECT id, title, isPrivate FROM notes;
```

Para probar una nota privada:

```sql
UPDATE notes SET isPrivate = 1 WHERE id = 1;
```

Luego consultar:

```text
GET /api/v1/notes/1/public
```

Resultado esperado:

```text
403 Forbidden
```

## Ejercicio 4 - Testing de CategoryService

Se mejoro la prueba unitaria Happy Path para la creacion de categorias en `CategoryService`.

Archivo principal:

```text
src/test/category.service.test.js
```

La prueba cumple con:

- Usa Jest.
- Prueba directamente `CategoryService`.
- Usa un mock del repositorio.
- No conecta MySQL.
- No conecta MongoDB.
- No levanta Express.
- Sigue el patron `Arrange -> Act -> Assert`.
- Verifica que la categoria creada tenga `name` y `userId`.
- Verifica que el repositorio fue llamado una sola vez.
- Verifica que el repositorio fue llamado con los datos correctos.

Comando para ejecutar la prueba:

```powershell
npm.cmd test -- src/test/category.service.test.js --runInBand
```

Comando para ejecutar toda la suite:

```powershell
npm.cmd test -- --runInBand
```

Resultado esperado:

```text
Test Suites: 4 passed, 4 total
Tests: 10 passed, 10 total
```

## Verificacion rapida de base de datos

Comandos utiles:

```sql
USE Notas_Final_db;
SHOW TABLES;
DESCRIBE categories;
DESCRIBE notes;
SELECT * FROM categories;
SELECT id, title, isPrivate, categoryId FROM notes;
```

Tablas esperadas:

```text
categories
notes
```

Campos importantes:

```text
categories: id, name, userId, createdAt, updatedAt
notes: id, title, content, imageUrl, isPrivate, password, userId, categoryId, createdAt, updatedAt
```
