type Task = { id: string; title: string; completed: boolean };
const tasks: Record<string, Task> = {};

const server = Bun.serve({
  port: 8000,
  routes: {
    // 📘 Получить все задачи
    "/tasks": {
      GET: () => Response.json(Object.values(tasks)),

      // 📗 Создать новую задачу
      POST: async (req) => {
        const body = await req.json();
        const id = crypto.randomUUID();
        const task: Task = {
          id,
          title: body.title || "Untitled Task",
          completed: false,
        };
        tasks[id] = task;
        return Response.json(task, { status: 201 });
      },
    },

    // 📙 Получить / обновить / удалить по ID
    "/tasks/:id": {
      GET: (req) => {
        const { id } = req.params;
        const task = tasks[id];
        return task
          ? Response.json(task)
          : new Response("Not Found", { status: 404 });
      },

      PATCH: async (req) => {
        const { id } = req.params;
        const task = tasks[id];
        if (!task) return new Response("Not Found", { status: 404 });

        const body = await req.json();
        task.title = body.title ?? task.title;
        task.completed = body.completed ?? task.completed;
        return Response.json(task);
      },

      DELETE: (req) => {
        const { id } = req.params;
        if (!tasks[id]) return new Response("Not Found", { status: 404 });
        delete tasks[id];
        return new Response(null, { status: 204 });
      },
    },
  },

  // 🧭 Обработка неизвестных маршрутов
  fetch(req) {
    return new Response(`No route for ${new URL(req.url).pathname}`, {
      status: 404,
    });
  },
});

console.log(
  `🚀 API Gateway running at http://${server.hostname}:${server.port}`
);
