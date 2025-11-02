export type Task = { id: string; title: string; completed: boolean };
export const tasks: Record<string, Task> = {};

export const getAllTasks = () => {
  return Response.json(Object.values(tasks));
};

export const createTask = async (req: Request) => {
  const body = await req.json();
  const id = crypto.randomUUID();
  const task: Task = {
    id,
    title: body.title || "Untitled Task",
    completed: false,
  };
  tasks[id] = task;
  return Response.json(task, { status: 201 });
};

export const getTaskById = (id: string) => {
  const task = tasks[id];
  return task
    ? Response.json(task)
    : new Response("Not Found", { status: 404 });
};

export const updateTask = async (req: Request, id: string) => {
  const task = tasks[id];
  if (!task) return new Response("Not Found", { status: 404 });

  const body = await req.json();
  task.title = body.title ?? task.title;
  task.completed = body.completed ?? task.completed;

  return Response.json(task);
};

export const deleteTask = (id: string) => {
  if (!tasks[id]) return new Response("Not Found", { status: 404 });
  delete tasks[id];
  return new Response(null, { status: 204 });
};
