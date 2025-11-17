export type Task = { id: string; title: string; completed: boolean };
export type RpcMessageTasks =
  | ({
      action: "GET" | "POST" | "PATCH";
    } & Task)
  | { action: "GET" | "POST" | "PATCH" }
  | { id: string; action: "getTaskById" }
  | { action: "DELETE"; id: string };
