export const port = 8888;
export const host = "127.0.0.1";
export const mimeTypes: { [key: string]: string } = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".woff": "application/font-woff",
  ".ttf": "application/font-ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "application/font-otf",
  ".wasm": "application/wasm",
  ".txt": "text/plain",
};
export function dateLog(
  method: string | undefined,
  url: string | undefined,
  ...info: any[]
): void {
  let log = `[${new Date().toTimeString()}]`;
  log = ` ${method}: ${url}`;
  info.forEach((str) => (log += ` [${str.toString()}]`));
  console.log(log);
  return;
}
