import { resolve } from "path";

import auth from "@config/auth";
import { CryptoProvider } from "@shared/container/providers/CryptoProvider/implementations/CryptoProvider";

export function GenerateFileUrl(pathFile: string[]): string {
  const cryptoProvider = new CryptoProvider();
  const path = resolve(...pathFile);
  const cryptoFileName = cryptoProvider.xorEncrypt({
    word: String(path),
    secret: auth.crypto_ids,
  });
  const buff = Buffer.from(cryptoFileName, "utf-8");
  return `${process.env.FILE_URL}${buff.toString("base64")}&time=${new Date().getTime().toFixed(0)}`;
}
