# AES-GCM-es

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

AES-GCM ES module for browsers and [Deno](https://deno.land/).

## Features
- Provides AES-GCM encryption and decryption functions
- Supports AES-128, AES-192, and AES-256
- Generates and increments Initialization Vectors (IVs)
- Dependency-free, except for the `forge-es` library

## Usage
```js
import { AESGCM } from "https://code4fukui.github.io/AES-GCM-es/AESGCM.js";

const someBytes = new TextEncoder().encode("hello!!");

// Generate a random key
const key = new Uint8Array(32);
for (let i = 0; i < key.length; i++) {
  key[i] = i;
}

// Generate a random IV
const iv = AESGCM.createIV();
console.log(iv);

// Encrypt and decrypt
const [data, tag] = AESGCM.encrypt(key, iv, someBytes);
console.log(data);
const dec = AESGCM.decrypt(key, iv, data, tag);
console.log(new TextDecoder().decode(dec));

// Increment the IV for next use
AESGCM.incrementIV(iv);
console.log(iv);
```

## Test
```sh
deno test --allow-import=code4fukui.github.io,deno.land test.js
```

## Dependencies
- [code4fukui/forge-es: A native implementation of TLS in Javascript and tools to write crypto-based and network-heavy webapps](https://github.com/taisukef/forge-es/)

## License
MIT License — see [LICENSE](LICENSE).