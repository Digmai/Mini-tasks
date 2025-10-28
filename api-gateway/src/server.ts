// Простая in-memory база (пока без БД)
const tasks: Record<string, { id: string; title: string; completed: boolean }> =
  {};

const server = Bun.serve({
  port: 8000,
  async fetch(req) {
    const url = new URL(req.url);
    const { pathname } = url;
    switch (req.method) {
      // GET /tasks — получить данные задачи.
      case "GET":
        if (pathname === "/tasks") {
          return new Response(JSON.stringify(Object.values(tasks)), {
            headers: { "Content-Type": "application/json" },
          });
        } else if (pathname.startsWith("/tasks/")) {
          const id = pathname.split("/")[2];
          const task = tasks[id];
          if (task) {
            return new Response(JSON.stringify(task), {
              headers: { "Content-Type": "application/json" },
            });
          }
        }
        break;
      // POST  /tasks — создать новую задачу.
      case "POST":
        if (pathname === "/tasks") {
          const id = crypto.randomUUID();
          const body = JSON.parse(await req.text());

          const newTask = {
            id,
            title: body.title || "Untitled Task",
            completed: false,
          };
          tasks[id] = newTask;

          return Response.json(newTask, { status: 201 });
        }
        break;
      // PATCH /tasks/:id — частично изменить существующую задачу.
      case "PATCH":
        if (pathname.startsWith("/tasks/")) {
          const id = pathname.split("/")[2];
          const task = tasks[id];
          if (task) {
            const body = JSON.parse(await req.text());
            task.completed = body.completed ?? task.completed;
            task.title = body.title ?? task.title;

            return Response.json(task);
          }
        }
        break;
      // DELETE /tasks/:id — удалить задачу.
      case "DELETE":
        if (pathname.startsWith("/tasks/")) {
          const id = pathname.split("/")[2];
          if (tasks[id]) {
            delete tasks[id];
            return new Response(null, { status: 204 });
          }
        }
        break;
      default:
        return new Response("405 Method Not Allowed", { status: 405 });
    }

    return new Response("404 Not Found", { status: 404 });
  },
});

console.log(`Server running at http://${server.hostname}:${server.port}`);
