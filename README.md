# AES-GCM-es

AES-GCM ES module for browsers and [Deno](https://deno.land/)

## usage

```js
import { AESGCM } from "https://code4fukui.github.io/AES-GCM-es/AESGCM.js";

const someBytes = new TextEncoder().encode("hello!!");

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
  console.log(new TextDecoder().decode(dec));
}
```

## test

```sh
deno test --allow-import=code4fukui.github.io,deno.land test.js
```

## dependencies

- [code4fukui/forge-es: A native implementation of TLS in Javascript and tools to write crypto-based and network-heavy webapps](https://github.com/taisukef/forge-es/)
