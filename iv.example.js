import { AESGCM } from "./AESGCM.js";
import { sleep } from "https://js.sabae.cc/sleep.js";
import { Base16 } from "https://code4fukui.github.io/Base16/Base16.js";

const iv1 = AESGCM.createIV();
for (;;) {
  console.log(Base16.encode(iv1));
  AESGCM.incrementIV(iv1);
  sleep(100);
}
