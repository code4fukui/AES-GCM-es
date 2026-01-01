import forge from "https://code4fukui.github.io/forge-es/lib/forge.js";
import {} from "https://code4fukui.github.io/forge-es/lib/aes.js";
import {} from "https://code4fukui.github.io/forge-es/lib/random.js";
import { Base16 } from "https://code4fukui.github.io/Base16/Base16.js";

const array2s = (ar) => {
  const res = [];
  for (let i = 0; i < ar.length; i++) {
    res.push(String.fromCharCode(ar[i]));
  }
  const s = res.join("");
  //console.log("a2s", ar, s);
  return s;
};
const s2array = (s) => {
  const res = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) {
    res[i] = s.charCodeAt(i);
  }
  return res;
};

class AESGCM {
  static createIV() {
    return s2array(forge.random.getBytesSync(16));
  }
  static incrementIV(iv) {
    for (let i = iv.length - 1; i >= 0; i--) {
      iv[i]++;
      if (iv[i]) {
        return;
      }
    }
  }
  static encrypt(key, iv, data) {
    const skey = array2s(key);
    const siv = array2s(iv);
    //console.log("siv", siv);
    //const iv = forge.random.getBytesSync(16);
    const cipher = forge.cipher.createCipher('AES-GCM', skey);
    cipher.start({
      iv: siv, // should be a 12-byte binary-encoded string or byte buffer
      additionalData: 'binary-encoded string', // optional
      tagLength: 128 // optional, defaults to 128 bits
    });
    cipher.update(forge.util.createBuffer(data));
    //cipher.update(new forge.util.ByteBuffer(array2s(data)));
    //console.log("data", data);
    //cipher.update(forge.util.createBuffer(array2s(data)));
    cipher.finish();
    const encrypted = cipher.output;
    const tag = cipher.mode.tag;
    // outputs encrypted hex
    /*
    console.log(encrypted.toHex());
    // outputs authentication tag
    console.log(tag.toHex());
    */
    return [Base16.decode(encrypted.toHex()), Base16.decode(tag.toHex())];
  }
  static decrypt(key, iv, data, tag) {
    const skey = array2s(key);
    const siv = array2s(iv);
    const decipher = forge.cipher.createDecipher('AES-GCM', skey);
    decipher.start({
      iv: siv,
      additionalData: 'binary-encoded string', // optional
      tagLength: 128, // optional, defaults to 128 bits
      tag: forge.util.createBuffer(tag) // authentication tag from encryption
    });
    decipher.update(forge.util.createBuffer(array2s(data)));
    //decipher.update(encrypted);
    const pass = decipher.finish();
    // pass is false if there was a failure (eg: authentication tag didn't match)
    if (!pass) {
      return null;
    }
    // outputs decrypted hex
    //console.log(decipher.output.toHex());
    return Base16.decode(decipher.output.toHex());
    //console.log(decipher.output.toString());
    //return s2array(decipher.output.toString());
  }
}

export { AESGCM };
