# AES-GCM-es

ブラウザとDeno向けのAES-GCM暗号化ライブラリです。

## 機能
- AES-GCMによる暗号化・復号機能
- AES-128、AES-192、AES-256に対応
- 初期化ベクトル(IV)の生成と更新機能
- `forge-es`ライブラリ以外は依存がない

## 使い方
```js
import { AESGCM } from "https://code4fukui.github.io/AES-GCM-es/AESGCM.js";

const someBytes = new TextEncoder().encode("hello!!");

// 32バイトのランダムキーを生成
const key = new Uint8Array(32);
for (let i = 0; i < key.length; i++) {
  key[i] = i;
}

// ランダムなIVを生成
const iv = AESGCM.createIV();
console.log(iv);

// 暗号化と復号
const [data, tag] = AESGCM.encrypt(key, iv, someBytes);
console.log(data);
const dec = AESGCM.decrypt(key, iv, data, tag);
console.log(new TextDecoder().decode(dec));

// IVを次の使用に向けて更新
AESGCM.incrementIV(iv);
console.log(iv);
```

## テスト
```sh
deno test --allow-import=code4fukui.github.io,deno.land test.js
```

## 依存関係
- [code4fukui/forge-es: A native implementation of TLS in Javascript and tools to write crypto-based and network-heavy webapps](https://github.com/taisukef/forge-es/)

## ライセンス
MIT License