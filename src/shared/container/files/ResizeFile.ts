import sharp from "sharp";

interface ISizes {
  prefix: string;
  width?: number;
  height?: number;
  maxSize?: number;
}
export interface IResizeImg {
  base64: string;
  fileName: string;
  sizes: ISizes[];
}

export async function ResizeFile({
  base64,
  fileName,
  sizes,
}: IResizeImg): Promise<
  {
    name: string;
    buffer: Buffer;
  }[]
> {
  const buffer = Buffer.from(base64, "base64");
  const promises = sizes.map(async (size) => {
    let targetWidth = size?.maxSize || size.width || 1200;
    let targetHeight = size?.maxSize || size.height || 1200;

    // --- Load image --- //
    const image = sharp(buffer);

    // --- Get original size --- //
    const metadata = await image.metadata();
    const originalWidth = metadata.width || 0;
    const originalHeight = metadata.height || 0;

    if (originalWidth > targetWidth || originalHeight > targetHeight) {
      // --- Calculate images proportions --- //
      if (originalWidth >= originalHeight) {
        targetHeight = Math.round(
          (originalHeight * targetWidth) / originalWidth,
        );
      } else {
        targetWidth = Math.round(
          (originalWidth * targetHeight) / originalHeight,
        );
      }
    } else {
      targetWidth = originalWidth;
      targetHeight = originalHeight;
    }

    const resizedImage = image.resize(targetWidth, targetHeight).toBuffer();
    return resizedImage;
  });
  const compressedImages = await Promise.all(promises);
  const response = compressedImages.map((cImg, index) => {
    const size = sizes[index];
    return {
      name: `${size.prefix}${fileName}`,
      buffer: cImg,
    };
  });
  return response;
}
