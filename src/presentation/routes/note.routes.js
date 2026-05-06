import { Router } from "express";
import NoteController from "../controllers/note.controller.js";
import NoteService from "../../application/use-cases/note.service.js";
import upload from "../middlewares/upload.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

import NoteMySQLRepository from "../../infrastructure/database/mysql/note.mysql.repository.js";
import MailService from "../../infrastructure/services/mail.service.js";

//  Inyección de dependencias
const mailService = new MailService();
const noteRepository = new NoteMySQLRepository();
const noteService = new NoteService(noteRepository, mailService);
const noteController = new NoteController(noteService);

const router = Router();

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Crear una nueva nota
 */
router.post("/", authMiddleware, upload.single("image"), noteController.createNote);

/**
 * @swagger
 * /notes:
 *   get:
 *     summary: Obtener todas las notas del usuario autenticado
 */
router.get("/", authMiddleware, noteController.getNotesByUserId);

/**
 * @swagger
 * /notes/{id}:
 *   put:
 *     summary: Actualizar una nota existente
 */
router.put("/:id", authMiddleware, upload.single("image"), noteController.updateNote);

/**
 * @swagger
 * /notes/{id}:
 *   delete:
 *     summary: Eliminar una nota (Solo Admins)
 */
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), noteController.deleteNote);

/**
 * @swagger
 * /notes/{id}/share:
 *   post:
 *     summary: Compartir una nota por email
 */
router.post("/:id/share", authMiddleware, noteController.shareNote);

//  EJERCICIO 3 (ruta pública)
router.get("/:id/public", noteController.getPublicNote);

export default router;
