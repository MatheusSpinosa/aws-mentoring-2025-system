/* eslint-disable prefer-regex-literals */
/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import fs from "fs";
import { resolve } from "path";

import { AppError } from "@errors/AppError";
import { S3Provider } from "@shared/container/providers/S3Provider/implementations/S3Provider";

import { GetMimeType } from "./GetMimeType";
import { ResizeFile } from "./ResizeFile";

export interface ISaveFilesProps {
  file: string;
  acceptMimeTypes: any;
  preString?: string;
  pathFolders: string[];
  manualFileHash?: string;
  sizes?: { prefix: string; maxSize: number }[];
}

export async function SaveFile({
  file,
  acceptMimeTypes,
  preString,
  pathFolders,
  manualFileHash,
  sizes,
}: ISaveFilesProps): Promise<string> {
  // --- Check if have image --- //

  if (!file) {
    throw new AppError("{name} is not valid", 400, "GENX003", { name: "file" });
  }
  let fileName = "";

  const base64Image = file;

  // --- Check mime type --- //
  const mimeType = String(base64Image).replace(/^data:([^;]+);.+$/g, "$1");

  let findMimeType = acceptMimeTypes[`${mimeType}`];
  const formatBase64 =
    String(base64Image).replace(/^[^,]+/g, "") || String(base64Image);
  const bufferFile = Buffer.from(formatBase64, "base64");

  if (!findMimeType) {
    const mime = GetMimeType(bufferFile);
    // console.log(mime, acceptMimeTypes[`${mime?.mimeType}`]);
    if (!acceptMimeTypes[`${mime?.mimeType}`]) {
      throw new AppError("Invalid file type", 400, "FILEX000");
    }
    findMimeType = acceptMimeTypes[`${mime?.mimeType}`];
  }

  // --- Check file --- //
  const testFile = new RegExp(
    /<(\?php|a|body|head|html|img|plaintext|pre|script|table|title|eval|exec)[\s>]/i,
  );

  if (file && testFile.test(String(file).substring(0, 600))) {
    throw new AppError(
      "Your request could not be processed, please try again later.",
      400,
      "GENX000",
    );
  }

  // --- Check file size --- //
  const size = bufferFile.length / 1024 / 1024;

  if (Number(size) > 3) {
    throw new AppError("The file is larger than 3MB");
  }

  const fileHash =
    manualFileHash ?? `-${crypto.randomBytes(16).toString("hex")}`;

  const name = `file-${preString}${fileHash}.${findMimeType}`;
  // --- Resize images --- //
  const resize = await ResizeFile({
    base64: formatBase64,
    fileName: name,
    sizes: sizes || [
      { prefix: "lg_", maxSize: 1200 },
      { prefix: "md_", maxSize: 800 },
      { prefix: "", maxSize: 300 },
    ],
  });

  // --- Save on bucket --- //
  if (process.env.AWS_BUCKET) {
    const s3 = new S3Provider();

    const promises = resize.map((rFile) => {
      return s3.saveFile({
        Bucket: process.env.AWS_BUCKET,
        Body: rFile.buffer,
        Key: `${
          pathFolders.length > 0 ? `${pathFolders.join("/")}/` : ""
        }${rFile.name}`,
      });
    });

    await Promise.all(promises);
  } else {
    // --- Save on local --- //
    resize.forEach((rFile) => {
      const dir = resolve(...pathFolders);

      const path = resolve(...pathFolders, `${rFile.name}`);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFile(
        path,
        rFile.buffer.toString("base64"),
        { encoding: "base64" },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        () => {},
      );
    });
  }

  fileName = name;
  return fileName;
}
