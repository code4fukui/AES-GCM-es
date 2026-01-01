import * as t from "https://deno.land/std/testing/asserts.ts";
import { AESGCM } from "./AESGCM.js";

Deno.test("simple", () => {
  const org = "や、hello!!";
  const someBytes = new TextEncoder().encode(org);

  // generate a random key
  // Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
  const key = new Uint8Array(32);
  for (let i = 0; i < key.length; i++) {
    key[i] = i;
  }

  // generate a random IV
  const iv = AESGCM.createIV();
  console.log(iv);
  {
    const [data, tag] = AESGCM.encrypt(key, iv, someBytes);
    console.log(data);

    const dec = AESGCM.decrypt(key, iv, data, tag);
    console.log(new TextDecoder().decode(dec));
  }
  AESGCM.incrementIV(iv); // must not use iv again
  console.log(iv);
  {
    const [data, tag] = AESGCM.encrypt(key, iv, someBytes);
    console.log(data);

    const dec = AESGCM.decrypt(key, iv, data, tag);
    const sdec = new TextDecoder().decode(dec);
    console.log(sdec);
    t.assertEquals(sdec, org);
  }
});
