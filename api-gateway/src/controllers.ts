import { QUEUE_NAME, sendRpcMessage } from "./rabbitmq";
import type { Task } from "./types";

export const tasks: Record<string, Task> = {};

export const getAllTasks = async () => {
  const result = await sendRpcMessage(QUEUE_NAME, {
    action: "GET",
  });

  if (result) {
    return Response.json(result, { status: 200 });
  } else {
    return new Response("No tasks found", { status: 404 });
  }
};

export const createTask = async (req: Request) => {
  const body = await req.json();

  if (typeof body.title === "string" && typeof body.completed === "boolean") {
    const result = await sendRpcMessage(QUEUE_NAME, {
      ...body,
      action: "POST",
    });
    return Response.json(result, { status: 201 });
  } else {
    return new Response("Invalid body structure", { status: 400 });
  }
};

export const getTaskById = async (id: string) => {
  if (id) {
    const result = await sendRpcMessage(QUEUE_NAME, {
      id,
      action: "getTaskById",
    });
    return Response.json(result, { status: 200 });
  } else {
    return new Response("Not Found", { status: 404 });
  }
};

export const updateTask = async (req: Request) => {
  const body = await req.json();

  if (
    typeof body === "object" &&
    typeof body.id === "string" &&
    typeof body.title === "string" &&
    typeof body.completed === "boolean"
  ) {
    const result = await sendRpcMessage(QUEUE_NAME, {
      ...body,
      action: "PATCH",
    });
    return Response.json(result, { status: 201 });
  } else {
    return new Response("Not Found", { status: 404 });
  }
};

export const deleteTask = async (id: string) => {
  const result = await sendRpcMessage(QUEUE_NAME, {
    action: "DELETE",
    id,
  });

  if (result) {
    return Response.json(result, { status: 204 });
  } else {
    return new Response("No tasks found", { status: 404 });
  }
};
