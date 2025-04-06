/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace Express {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  export interface Request {
    customer?: {
      id: number;
      language?: "pt-br" | "en-us";
      customerCurrency?: number;
      data?: any;
    };
    queryRunner?: {
      id: string;
      queryRunner: any;
    };
    csrfInfo?: {
      id: string;
      customer?: number;
      ip: string;
      agent?: string;
      appAgent?: {
        app: string;
        device: string;
        model: string;
        platform: string;
        brand: string;
        manufacturer: string;
        deviceName: string;
        type: string;
        osVersion: string;
        expoToken?: string;
      };
    };
    appAgent?: {
      app: string;
      device: string;
      model: string;
      platform: string;
      brand: string;
      manufacturer: string;
      deviceName: string;
      type: string;
      osVersion: string;
      expoToken?: string;
    };
    userAgent: {
      ip: string;
      browser: string;
      version: string;
      platform: string;
      agent: string;
    };
  }
}
