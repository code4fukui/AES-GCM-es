# AES-GCM-es

ブラウザおよび [Deno](https://deno.land/) 向けの、AES-GCM暗号化・復号化を行うシンプルなESモジュールです。

## 機能

- AES-GCMによる暗号化および復号化。
- 128、192、256ビットの鍵をサポート（16、24、32バイトの `Uint8Array` を使用）。
- 暗号論的に安全な乱数による16バイト（128ビット）の初期化ベクトル（IV）を生成。
- 連続する暗号化処理に安全に備えるためのIVインクリメント（増分）機能を提供。
- 最小限の依存関係。

## 使い方

### モジュールのインポート

```js
import { AESGCM } from "https://code4fukui.github.io/AES-GCM-es/AESGCM.js";
```

### 使用例

```js
// 1. データの準備
const plaintext1 = new TextEncoder().encode("Hello, world!");
const plaintext2 = new TextEncoder().encode("This is the second message.");

// 2. セキュアな鍵の生成
// 鍵のサイズによってAESのバリアントが決まります：
// 16バイト = AES-128
// 24バイト = AES-192
// 32バイト = AES-256
const key = crypto.getRandomValues(new Uint8Array(32)); // AES-256を使用

// 3. 初期IVの生成
// IVは、同じ鍵での暗号化ごとに一意である必要があります。
const iv = AESGCM.createIV();

// 4. 最初のメッセージを暗号化
const [encrypted1, tag1] = AESGCM.encrypt(key, iv, plaintext1);
console.log("Encrypted data 1:", encrypted1);

// 5. 最初のメッセージを復号化
const decrypted1 = AESGCM.decrypt(key, iv, encrypted1, tag1);
console.log("Decrypted text 1:", new TextDecoder().decode(decrypted1)); // "Hello, world!"

// 6. 次のメッセージ用にIVをインクリメント
// ⚠️ 重要: 同じ鍵で同じIVを絶対に再利用しないでください。
AESGCM.incrementIV(iv);

// 7. 新しいIVで2番目のメッセージを暗号化
const [encrypted2, tag2] = AESGCM.encrypt(key, iv, plaintext2);
console.log("Encrypted data 2:", encrypted2);

// 8. 2番目のメッセージを復号化
const decrypted2 = AESGCM.decrypt(key, iv, encrypted2, tag2);
console.log("Decrypted text 2:", new TextDecoder().decode(decrypted2)); // "This is the second message."
```

## API

### `AESGCM.createIV()`
初期化ベクトル（IV）として使用するための、暗号論的に安全な乱数による新しい16バイトの `Uint8Array` を生成して返します。

### `AESGCM.incrementIV(iv)`
指定された16バイトの `Uint8Array` IVをインプレースでインクリメント（増分）します。これは、次のメッセージ用に新しく一意なIVを生成し、IVの再利用を防ぐための標準的なカウンターモードの手法です。

### `AESGCM.encrypt(key, iv, data)`
AES-GCMを使用してデータを暗号化します。
- `key`: 16、24、または32バイトの `Uint8Array`。
- `iv`: 16バイトの `Uint8Array`。
- `data`: 暗号化する平文の `Uint8Array`。
- **戻り値**: `[encryptedData, authenticationTag]` の配列。両方の要素は `Uint8Array` です。

### `AESGCM.decrypt(key, iv, data, tag)`
データを復号化し、タグを使用してその真正性を検証します。
- `key`: 暗号化に使用したのと同じ `Uint8Array` の鍵。
- `iv`: 暗号化に使用したのと同じ `Uint8Array` のIV。
- `data`: 暗号化されたデータの `Uint8Array`。
- `tag`: `encrypt` メソッドが返した `Uint8Array` の認証タグ。
- **戻り値**: 成功した場合は復号化された `Uint8Array`、認証に失敗した場合は `null`。

## テスト

```sh
deno test --allow-read test.js
```

## 依存関係

- [code4fukui/forge-es](https://github.com/code4fukui/forge-es)
- [code4fukui/Base16](https://github.com/code4fukui/Base16)

## ライセンス

MIT License
