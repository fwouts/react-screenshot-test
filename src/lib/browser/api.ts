export interface Browser {
  start(): Promise<void>;
  stop(): Promise<void>;
  render(url: string): Promise<string>;
}
