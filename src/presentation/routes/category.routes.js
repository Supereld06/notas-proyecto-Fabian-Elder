import { Router } from "express";

export const categoryRoutes = (controller, authMiddleware) => {
  const router = Router();

  router.post("/", authMiddleware, controller.create);
  router.get("/", authMiddleware, controller.getAll);
  router.get("/:id", authMiddleware, controller.getById);
  router.put("/:id", authMiddleware, controller.update);
  router.delete("/:id", authMiddleware, controller.delete);

  return router;
};