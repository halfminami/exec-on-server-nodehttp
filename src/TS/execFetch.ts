import { CMD_POST, CMD_RESPONSE } from "../../global.js";
/**
 * fetch "/exec"
 * @param postjson
 * @returns resolves server response even if exec itself fails
 */
function execFetch(postjson: CMD_POST): Promise<CMD_RESPONSE> {
  return new Promise((res, rej) => {
    fetch("/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify(postjson),
    })
      .then((ret) => ret.json())
      .then((retjson) => res(retjson))
      .catch((err) => rej(err));
  });
}

/**
 * make post json from cmd and stdin
 * @param str cmd (and arg)
 * @param stdin stdin during exec
 * @returns resolve json to post
 * @example <caption>command with multiple args</caption>
 * // returns {cmd: "cowsay", arg ["-e", "AA", "hi", "mom"], stdin: ""}
 * makePostJson("cowsay -e AA hi mom");
 */
function makePostJson(str: string, stdin = ""): Promise<CMD_POST> {
  return new Promise((res, rej) => {
    const arr = str.split(" ");
    const postjson: CMD_POST = {
      cmd: arr[0],
      arg: arr.slice(1, arr.length),
      stdin: stdin,
    };
    if (!postjson.cmd) {
      rej("command is empty");
      return;
    }
    res(postjson);
  });
}

/**
 * make json and post "/exec"
 * @param str cmd (and arg)
 * @param stdin stdin during exec
 * @returns resolves server response even if exec itself fails
 */
function execSimpleFetch(str: string, stdin = ""): Promise<CMD_RESPONSE> {
  return new Promise((res, rej) => {
    makePostJson(str, stdin)
      .then((postjson) => execFetch(postjson))
      .then((ret) => res(ret))
      .catch((err) => rej(err));
  });
}

export { execFetch, makePostJson, execSimpleFetch };
