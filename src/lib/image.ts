const MAX_EDGE = 1600;
const QUALITY = 0.8;

export async function optimizeImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Selecione um arquivo de imagem.");
  }

  if (typeof document === "undefined") {
    throw new Error("A otimização da imagem só acontece no navegador.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close();
    throw new Error("Não foi possível processar a imagem.");
  }

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const webp = await canvasToBlob(canvas, "image/webp");
  const blob = webp ?? (await canvasToBlob(canvas, "image/jpeg"));

  if (!blob) {
    throw new Error("Não foi possível otimizar a imagem.");
  }

  const type = blob.type || (webp ? "image/webp" : "image/jpeg");
  const extension = type === "image/webp" ? "webp" : "jpg";
  return new File([blob], `imagem.${extension}`, { type });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, QUALITY);
  });
}
