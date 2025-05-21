/* eslint-disable no-dupe-else-if */
/* eslint-disable no-else-return */
export function GetMimeType(
  buffer: Buffer,
): { extension: string; mimeType: string } | null {
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    return { extension: "jpg", mimeType: "image/jpg" };
  } else if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { extension: "png", mimeType: "image/png" };
  } else if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return { extension: "gif", mimeType: "image/gif" };
  } else if (buffer[0] === 0x42 && buffer[1] === 0x4d) {
    return { extension: "bmp", mimeType: "image/bmp" };
  } else if (buffer[3] === 0x46) {
    return { extension: "pdf", mimeType: "application/pdf" };
  } else if (
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04
  ) {
    return {
      extension: "docx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
  } else if (
    buffer[0] === 0x50 &&
    buffer[1] === 0x4b &&
    buffer[2] === 0x03 &&
    buffer[3] === 0x04
  ) {
    return {
      extension: "xlsx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };
  } else if (
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  ) {
    return { extension: "txt", mimeType: "text/plain" };
  } else {
    return null;
  }
}
