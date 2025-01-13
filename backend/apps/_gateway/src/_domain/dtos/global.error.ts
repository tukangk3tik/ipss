export class GlobalError {
  error_key: string;
  error_args: any;
  error_status?: number;

  constructor(partial: Partial<GlobalError>) {
    Object.assign(this, partial);
  }
}
