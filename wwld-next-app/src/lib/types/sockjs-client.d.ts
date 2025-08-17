declare module "sockjs-client" {
  export default class SockJS {
    constructor(url: string, _protocols?: any, options?: any);

    // theo chuẩn WebSocket interface
    readyState: number;
    protocol: string;
    url: string;

    // event handler
    onopen: ((this: SockJS, ev: Event) => any) | null;
    onclose: ((this: SockJS, ev: CloseEvent) => any) | null;
    onmessage: ((this: SockJS, ev: MessageEvent) => any) | null;
    onerror: ((this: SockJS, ev: Event) => any) | null;

    // methods
    send(data: string): void;
    close(code?: number, reason?: string): void;
    addEventListener(
      type: "open" | "close" | "message" | "error",
      listener: (event: any) => void
    ): void;
    removeEventListener(
      type: "open" | "close" | "message" | "error",
      listener: (event: any) => void
    ): void;
  }
}
