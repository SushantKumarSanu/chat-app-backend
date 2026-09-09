import { DefaultEventsMap } from "socket.io/dist/typed-events";

declare module "socket.io" {
  interface Socket<
    ListenEvents = DefaultEventsMap,
    EmitEvents = DefaultEventsMap,
    ServerSideEvents = DefaultEventsMap,
    SocketData = any
  > {
    userId?: string;
  }
}

export {};