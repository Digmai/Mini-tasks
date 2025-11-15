import {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} from "./controllers";

export const taskRoutes = {
  "/tasks": {
    GET: () => getAllTasks(),
    POST: (req: Request) => createTask(req),
  },

  "/tasks/:id": {
    GET: (req: any) => getTaskById(req.params.id),
    PATCH: (req: any) => updateTask(req),
    DELETE: (req: any) => deleteTask(req.params.id),
  },
};
