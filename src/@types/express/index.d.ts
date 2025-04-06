/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface Request {
    customer?: any;
    queryRunner?: {
      id: string;
      queryRunner: any;
    };
  }
}
