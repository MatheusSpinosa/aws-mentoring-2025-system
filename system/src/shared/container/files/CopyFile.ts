/* eslint-disable prefer-regex-literals */
/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import { resolve } from "path";

import { AppError } from "@errors/AppError";
import { S3Provider } from "@shared/container/providers/S3Provider/implementations/S3Provider";

interface IProps {
  file: string;
  destinationFileName: string;
  preString?: string;
  pathFolders: string[];
  manualFileHash?: string;
}

export async function CopyFile({
  file,
  destinationFileName,
  pathFolders,
}: IProps): Promise<string> {
  // --- Check if have image --- //
  const regex = /(?:\.([^.]+))?$/;
  const match = String(file).match(regex);
  if (!file || !match[1]) {
    throw new AppError("{name} is not valid", 400, "GENX003", { name: "file" });
  }

  const name = `${destinationFileName}.${match[1]}`;

  // --- Save on bucket --- //
  if (process.env.AWS_BUCKET) {
    const s3 = new S3Provider();
    return s3.copyFile({
      Bucket: process.env.AWS_BUCKET,
      CopySource: destinationFileName,
      Key: `${
        pathFolders.length > 0 ? `${pathFolders.join("/")}/` : ""
      }${name}`,
    });

    // await Promise.all(promises)
  }
  // --- Save on local --- //
  const dir = resolve(...pathFolders);

  const path = resolve(...pathFolders, `${name}`);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.copyFileSync(file, path);

  return name;
}
