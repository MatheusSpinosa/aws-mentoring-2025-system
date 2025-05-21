export interface ICopyFileDTO {
  Bucket: string;
  Key: string;
  CopySource: string;
}

export interface ISaveFileDTO {
  Bucket: string;
  Key: string;
  Body: Buffer;
}

export interface IGetFileDTO {
  Bucket: string;
  Key: string;
  ContentType?: string;
}
