import { CMD_POST, CMD_RESPONSE } from "../../global.js";
import * as settings from "./settings.js";
import { spawnChildProcess } from "./exec.js";
import * as http from "node:http";
import * as fspromises from "node:fs/promises";
import * as path from "node:path";
const rootDir = "./public";
/**
 * static file server and server command execution
 * @see {@link https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework}
 */
const server = http.createServer(function (req, res) {
  let postdata = "";
  req.setEncoding("utf-8");
  req.on("data", (chunk) => {
    postdata += chunk;
  });
  req.on("end", () => {
    let filePath = (req.url || "/").split("?")[0];
    // "/exec"
    if (filePath == "/exec") {
      new Promise((resolve) => {
        resolve(JSON.parse(postdata));
      })
        .then((postjson: any) => spawnChildProcess(postjson))
        .then((ret) => {
          res.writeHead(200, {
            "Content-Type": "application/json; charset=UTF-8",
          });
          res.end(JSON.stringify(ret), "utf-8", () =>
            settings.dateLog(req.method, req.url, ret.cmd, ret.exitcode)
          );
        })
        .catch((err) => {
          res.writeHead(500, {
            "Content-Type": "application/json; charset=UTF-8",
          });
          res.end(JSON.stringify({ error: err }), "utf-8", () =>
            settings.dateLog(req.method, req.url, err)
          );
        });
      return;
    }
    // parse url
    if (filePath.endsWith("/")) {
      filePath += "index.html";
    }
    filePath = rootDir + filePath;
    // static file server
    const ext = path.extname(filePath).toLowerCase();
    let contentType = settings.mimeTypes[ext] || "application/octet-stream";
    contentType += "; charset=UTF-8";
    new Promise((resolve) =>
      resolve(fspromises.readFile(filePath, { encoding: "utf-8" }))
    )
      .then((content) => {
        res.writeHead(200, { "Content-Type": contentType });
        res.end(content, "utf-8", () => settings.dateLog(req.method, req.url));
      })
      .catch((err) => {
        if (err.code == "ENOENT") {
          res.writeHead(404);
          res.end("file not found\n", "utf-8", () =>
            settings.dateLog(req.method, req.url, "ENOENT")
          );
        } else {
          res.writeHead(500);
          res.end("sorry error\n", "utf-8", () =>
            settings.dateLog(req.method, req.url, err)
          );
        }
      });
  });
});

server.listen(settings.port, settings.host);
console.log(
  `node http server💪 running at http://${settings.host}:${settings.port}`
);
