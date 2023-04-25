import { CMD_POST, CMD_RESPONSE } from "../../global.js";
import * as childprocess from "node:child_process";
/** commands that are recognized */
const cmdDict: { [key: string]: { cmd: string; arg: string[] } } = {
  echo: { cmd: "echo", arg: [] },
  cat: { cmd: "cat", arg: ["./src/TS/execFetch.ts"] },
  pwd: { cmd: "pwd", arg: [] },
};
const execPath = "./";

/**
 * execute a command
 * @param postjson
 * @returns exitcode is null if it closed due to timeout
 */
function spawnChildProcess(postjson: CMD_POST): Promise<CMD_RESPONSE> {
  return new Promise((res, rej) => {
    if (!postjson.cmd) {
      rej("empty command");
      return;
    }
    if (!cmdDict[postjson.cmd]) {
      rej("undefined command");
      return;
    }
    if (typeof postjson.arg != "object") {
      rej("arg must be string array");
      return;
    }
    const retjson: CMD_RESPONSE = {
      cmd: postjson.cmd,
      arg: postjson.arg,
      stdin: postjson.stdin,
      stderr: "",
      stdout: "",
      exitcode: null,
    };

    const child = childprocess.spawn(
      cmdDict[postjson.cmd].cmd,
      (cmdDict[postjson.cmd].arg || []).concat(postjson.arg),
      { cwd: execPath, timeout: 5000 }
    );

    child.stdin.write(postjson.stdin);
    child.stdin.end();

    child.stdout.on("data", (data) => {
      retjson.stdout += data.toString("utf8");
    });
    child.stderr.on("data", (data) => {
      retjson.stderr += data.toString("utf8");
    });

    child.on("close", (code) => {
      retjson.exitcode = code;
      res(retjson);
    });
    return;
  });
}

export { spawnChildProcess };
