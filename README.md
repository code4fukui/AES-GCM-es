# AES-GCM-es

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A simple ES module for AES-GCM encryption and decryption in browsers and [Deno](https://deno.land/).

## Features

- AES-GCM encryption and decryption.
- Supports 128, 192, and 256-bit keys (via 16, 24, or 32-byte `Uint8Array` keys).
- Generates cryptographically random 16-byte (128-bit) Initialization Vectors (IVs).
- Provides an IV increment function to safely prepare for subsequent encryptions.
- Minimal dependencies.

## Usage

### Import the module

```js
import { AESGCM } from "https://code4fukui.github.io/AES-GCM-es/AESGCM.js";
```

### Example

```js
// 1. Prepare your data
const plaintext1 = new TextEncoder().encode("Hello, world!");
const plaintext2 = new TextEncoder().encode("This is the second message.");

// 2. Generate a secure key
// The key size determines the AES variant:
// 16 bytes = AES-128
// 24 bytes = AES-192
// 32 bytes = AES-256
const key = crypto.getRandomValues(new Uint8Array(32)); // Using AES-256

// 3. Generate an initial IV
// The IV must be unique for each encryption with the same key.
const iv = AESGCM.createIV();

// 4. Encrypt the first message
const [encrypted1, tag1] = AESGCM.encrypt(key, iv, plaintext1);
console.log("Encrypted data 1:", encrypted1);

// 5. Decrypt the first message
const decrypted1 = AESGCM.decrypt(key, iv, encrypted1, tag1);
console.log("Decrypted text 1:", new TextDecoder().decode(decrypted1)); // "Hello, world!"

// 6. Increment the IV for the next message
// ⚠️ CRITICAL: Never reuse the same IV with the same key.
AESGCM.incrementIV(iv);

// 7. Encrypt the second message with the new IV
const [encrypted2, tag2] = AESGCM.encrypt(key, iv, plaintext2);
console.log("Encrypted data 2:", encrypted2);

// 8. Decrypt the second message
const decrypted2 = AESGCM.decrypt(key, iv, encrypted2, tag2);
console.log("Decrypted text 2:", new TextDecoder().decode(decrypted2)); // "This is the second message."
```

## API

### `AESGCM.createIV()`
Generates and returns a new cryptographically random 16-byte `Uint8Array` to be used as an Initialization Vector (IV).

### `AESGCM.incrementIV(iv)`
Increments the provided 16-byte `Uint8Array` IV in-place. This is a standard counter mode method for generating a new, unique IV for the next message, preventing IV reuse.

### `AESGCM.encrypt(key, iv, data)`
Encrypts data using AES-GCM.
-   `key`: A `Uint8Array` of 16, 24, or 32 bytes.
-   `iv`: A 16-byte `Uint8Array`.
-   `data`: The `Uint8Array` of plaintext to encrypt.
-   **Returns**: An array `[encryptedData, authenticationTag]`, where both elements are `Uint8Array`s.

### `AESGCM.decrypt(key, iv, data, tag)`
Decrypts data and verifies its authenticity using the tag.
-   `key`: The same `Uint8Array` key used for encryption.
-   `iv`: The same `Uint8Array` IV used for encryption.
-   `data`: The `Uint8Array` of encrypted data.
-   `tag`: The `Uint8Array` authentication tag returned by `encrypt`.
-   **Returns**: The decrypted `Uint8Array` on success, or `null` if authentication fails.

## Test

```sh
deno test --allow-read test.js
```

## Dependencies

-   [code4fukui/forge-es](https://github.com/code4fukui/forge-es)
-   [code4fukui/Base16](https://github.com/code4fukui/Base16)

## License

MIT License