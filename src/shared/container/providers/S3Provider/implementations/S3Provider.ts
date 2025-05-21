/* eslint-disable @typescript-eslint/no-explicit-any */
import AWS, { S3 } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import internal from "stream";

import { ICopyFileDTO, IGetFileDTO, ISaveFileDTO } from "../dtos/S3DTO";
import { IS3Provider } from "../IS3Provider";

class S3Provider implements IS3Provider {
  private s3: AWS.S3;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_BUCKET_USER,
      secretAccessKey: process.env.AWS_BUCKET_PSWD,
    });
    this.s3 = new AWS.S3({ region: process.env.AWS_BUCKET_REGION });
  }

  getFileByStream(data: IGetFileDTO): internal.Readable {
    const stream = this.s3.getObject(data).createReadStream();
    return stream;
  }

  async getFile(
    data: IGetFileDTO,
  ): Promise<PromiseResult<S3.GetObjectOutput, AWS.AWSError>> {
    const file = await this.s3.getObject(data).promise();
    return file;
  }

  async listAllKeysInFolder(
    bucketName: string,
    folderPath: string,
  ): Promise<string[]> {
    const params: S3.ListObjectsV2Request = {
      Bucket: bucketName,
      Prefix: folderPath.endsWith("/") ? folderPath : `${folderPath}/`,
    };

    try {
      const data = await this.s3.listObjectsV2(params).promise();
      const keys = data.Contents?.map((object) => object.Key) || [];
      return keys;
    } catch (error) {
      console.error("Erro ao listar arquivos no S3:", error);
      throw error;
    }
  }

  async copyFile(data: ICopyFileDTO): Promise<any> {
    const response = await this.s3.copyObject(data).promise();
    return response;
  }

  async saveFile(data: ISaveFileDTO): Promise<any> {
    const response = await this.s3.upload(data).promise();
    return response;
  }

  async deleteFile(
    data: S3.DeleteObjectRequest,
  ): Promise<PromiseResult<S3.DeleteObjectOutput, AWS.AWSError>> {
    const response = await this.s3.deleteObject(data).promise();
    return response;
  }

  async deleteFiles(
    data: S3.DeleteObjectsRequest,
  ): Promise<PromiseResult<S3.DeleteObjectsOutput, AWS.AWSError>> {
    const response = await this.s3.deleteObjects(data).promise();
    return response;
  }

  // async test(): Promise<void> {
  //   const params = {
  //     Bucket: "nextwin",
  //     Key: `test_folder/file_test.jpg`,
  //     // Body: fs.readFileSync(resolve("flag_pt.jpg")),
  //   };
  //   this.s3.getObject(params, function (err, data) {
  //     if (err) {
  //       console.log("Erro ao fazer upload:", err);
  //     } else {
  //       console.log("Upload com sucesso!", data.Body.toString("base64"));
  //     }
  //   });
  // }
}

export { S3Provider };
