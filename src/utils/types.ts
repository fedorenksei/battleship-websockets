import { RequestCommands, ResponseCommands } from './commands-types';

type ExtractedPayloadTypes<T extends Record<string, unknown>> = {
  [K in keyof T]: { type: K; data: T[K] };
};
type Payload<T extends Record<string, unknown>> =
  ExtractedPayloadTypes<T>[keyof T];

export type RequestPayload = Payload<RequestCommands>;
export type ResponsePayload = Payload<ResponseCommands>;
