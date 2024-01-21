export class CustomException<T> extends Error {
  code: number;
  data?: T;

  constructor(code: number, message: string, data?: T) {
    super(message);
    this.code = code;
    this.data = data;
  }
}
