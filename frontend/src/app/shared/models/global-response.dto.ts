
export class GlobalResponse {
  statusCode: number | undefined;
  message: string | undefined;
  data: any;

  constructor(partial: Partial<GlobalResponse>) {
    Object.assign(this, partial);
  }
}
