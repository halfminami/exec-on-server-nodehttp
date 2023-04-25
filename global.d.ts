export type CMD_POST = { cmd: string; arg: string[]; stdin: string };
export type CMD_RESPONSE = CMD_POST & {
  stdout: string;
  stderr: string;
  exitcode: number | null;
};
