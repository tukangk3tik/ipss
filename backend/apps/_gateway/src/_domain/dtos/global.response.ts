export class GlobalResponse {
  statusCode: number;
  message: string;
  data: any;

  constructor(partial: Partial<GlobalResponse>) {
    Object.assign(this, partial);
  }
}
