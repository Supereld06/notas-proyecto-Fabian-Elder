import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import morgan from 'morgan';

import { loggerMiddleware } from './presentation/middlewares/logger.middleware.js';
import noteRoutes from './presentation/routes/note.routes.js';
import authRoutes from './presentation/routes/auth.routes.js';
import { categoryRoutes } from "./presentation/routes/category.routes.js";

import { connectMongo } from './infrastructure/database/mongo/connection.js';
import { setupSwagger } from './infrastructure/config/swagger.config.js';

// CATEGORY IMPORTS
import { CategoryRepository } from "./infrastructure/database/mongo/category.mongo.repository.js";
import { CategoryService } from "./application/use-cases/category.service.js";
import { CategoryController } from "./presentation/controllers/category.controller.js";
import { authMiddleware } from "./presentation/middlewares/auth.middleware.js";

await connectMongo();

const app = express();

app.use(cors());
app.use(express.json());
setupSwagger(app);
app.use(loggerMiddleware);
app.use(morgan('dev'));

app.use('/uploads', express.static('uploads'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notes', noteRoutes);

// INSTANCIAS
const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

// ROUTES
app.use("/api/v1/categories", categoryRoutes(categoryController, authMiddleware));

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API de notas activa' });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});