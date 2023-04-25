import { execSimpleFetch } from "./execFetch.js";
window.addEventListener("DOMContentLoaded", () => {
  const cmd = document.querySelector("input");
  const stdin = document.querySelector("textarea");
  const btn = document.querySelector("button");
  const out = document.querySelector("pre");

  if (cmd && stdin && btn && out) {
    btn.addEventListener("click", () => {
      execSimpleFetch(cmd.value, stdin.value)
        .then((ret) => {
          if (ret.exitcode == 0) {
            out.textContent = ret.stdout;
          } else {
            out.textContent = "error.";
          }
          console.log(ret);
        })
        .catch((err) => {
          out.textContent = "error.";
          console.log(err);
        });
    });
  }
});
