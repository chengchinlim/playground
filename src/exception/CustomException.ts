export default class CustomException<T> extends Error {
  code: number;
  data?: T;
  constructor(code: number, message: string, data?: T) {
    super(message);
    this.code = code;
    this.data = data;
  }
}

export class ResourceNotFound extends CustomException<any> {
  constructor(data?: object) {
    super(404, 'Requested resource not found', data);
  }
}
