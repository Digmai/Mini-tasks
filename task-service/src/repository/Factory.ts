import { commandGET } from "./commandGet";
import { commandPOST } from "./commandPost";
import { commandPATCH } from "./commandPatch";
import { commandDELETE } from "./commandDelete";

export function FactorySelectCommand(action: string, message: any) {
  if (action === "GET") return commandGET(message);
  if (action === "POST") return commandPOST(message);
  if (action === "PATCH") return commandPATCH(message);
  if (action === "DELETE") return commandDELETE(message);

  return { error: "action is required" };
}
