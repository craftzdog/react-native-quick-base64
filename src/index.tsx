declare function base64ToArrayBuffer(data: string): ArrayBuffer;
declare function base64FromArrayBuffer(data: string | ArrayBuffer): string;

// from https://github.com/beatgammit/base64-js/blob/master/index.js
function getLens(b64: string) {
  var len = b64.length;

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4');
  }

  var validLen = b64.indexOf('=');
  if (validLen === -1) validLen = len;

  var placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4);

  return [validLen, placeHoldersLen];
}

export function byteLength(b64: string): number {
  var lens = getLens(b64);
  var validLen = lens[0];
  var placeHoldersLen = lens[1];
  return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen;
}

export function toByteArray(b64: string): Uint8Array {
  return new Uint8Array(base64ToArrayBuffer(b64));
}

export function fromByteArray(uint8: Uint8Array): string {
  return base64FromArrayBuffer(uint8.buffer);
}

export function btoa(data: string): string {
  return base64FromArrayBuffer(data);
}

export function atob(b64: string): string {
  return String.fromCharCode.apply(
    null,
    // @ts-ignore
    new Uint8Array(base64ToArrayBuffer(b64))
  );
}

export function shim() {
  (global as any).btoa = btoa;
  (global as any).atob = atob;
}
