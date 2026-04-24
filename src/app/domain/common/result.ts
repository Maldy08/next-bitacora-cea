export interface Result<T> {
  messages: any[];
  succeeded: boolean;
  data: T;
  exception: null;
  code: number;
}
