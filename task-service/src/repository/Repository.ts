import type { RpcMessageTasks } from "../types";
import { FactorySelectCommand } from "./Factory";

export class Repository {
  private action: string;
  private msg: RpcMessageTasks;
  constructor(msg: RpcMessageTasks) {
    this.action = msg.action;
    this.msg = msg;
  }
  resolve() {
    const command = FactorySelectCommand(this.action, this.msg);
    return command;
  }
}
