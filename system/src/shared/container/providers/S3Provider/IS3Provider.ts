/* eslint-disable @typescript-eslint/no-explicit-any */
import AWS, { S3 } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import internal from "stream";

import { ICopyFileDTO, IGetFileDTO, ISaveFileDTO } from "./dtos/S3DTO";

interface IS3Provider {
  getFileByStream(data: IGetFileDTO): internal.Readable;
  getFile(
    data: IGetFileDTO,
  ): Promise<PromiseResult<S3.GetObjectOutput, AWS.AWSError>>;
  listAllKeysInFolder(
    bucketName: string,
    folderPath: string,
  ): Promise<string[]>;
  copyFile(data: ICopyFileDTO): Promise<any>;
  saveFile(data: ISaveFileDTO): Promise<any>;
  deleteFile(
    data: S3.DeleteObjectRequest,
  ): Promise<PromiseResult<S3.DeleteObjectOutput, AWS.AWSError>>;
  deleteFiles(
    data: S3.DeleteObjectsRequest,
  ): Promise<PromiseResult<S3.DeleteObjectsOutput, AWS.AWSError>>;
  // test(): Promise<void>;
}

export { IS3Provider };
