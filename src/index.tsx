declare function base64ToArrayBuffer(data: string): ArrayBuffer;
declare function base64FromArrayBuffer(data: string | ArrayBuffer): string;

// from https://github.com/beatgammit/base64-js/blob/master/index.js
function getLens(b64: string) {
  let len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  }

  let validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;

  let placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4);

  return [validLen, placeHoldersLen];
}

function uint8ArrayToString(array: Uint8Array) {
  let out = '',
    i = 0,
    len = array.length;
  while (i < len) {
    const c = array[i++];
    out += String.fromCharCode(c);
  }
  return out;
}

function stringToArrayBuffer(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export function byteLength(b64: string): number {
  let lens = getLens(b64);
  let validLen = lens[0];
  let placeHoldersLen = lens[1];
  return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen;
}

export function toByteArray(b64: string): Uint8Array {
  return new Uint8Array(base64ToArrayBuffer(b64));
}

export function fromByteArray(uint8: Uint8Array): string {
  return base64FromArrayBuffer(uint8.buffer);
}

export function btoa(data: string): string {
  return base64FromArrayBuffer(stringToArrayBuffer(data));
}

export function atob(b64: string): string {
  const ua = new Uint8Array(base64ToArrayBuffer(b64));
  return uint8ArrayToString(ua);
}

export function shim() {
  (global as any).btoa = btoa;
  (global as any).atob = atob;
}
