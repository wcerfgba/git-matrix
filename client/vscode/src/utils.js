import { inspect } from "util";

export const log = (arg) => {
  console.log(inspect(arg))
}