import nativeModule from './NativeQuickBase64'

/**
 * Calculates valid length and placeholder length for base64 string
 */
function getLens(b64: string) {
  const len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  let validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  const placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4)

  return [validLen, placeHoldersLen] as const
}

/**
 * Calculates the byte length of a base64 string
 */
export function byteLength(b64: string) {
  const [validLen, placeHoldersLen] = getLens(b64)
  return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen
}

/**
 * Converts base64 string to Uint8Array
 */
export function toByteArray(
  b64: string,
  removeLinebreaks: boolean = false
): Uint8Array {
  return new Uint8Array(
    nativeModule.base64ToArrayBuffer(b64, removeLinebreaks) as ArrayBuffer
  )
}

/**
 * Converts Uint8Array to base64 string
 */
export function fromByteArray(
  uint8: Uint8Array,
  urlSafe: boolean = false
): string {
  if (uint8.buffer.byteLength > uint8.byteLength || uint8.byteOffset > 0) {
    const buffer =
      uint8.buffer instanceof ArrayBuffer
        ? uint8.buffer.slice(
            uint8.byteOffset,
            uint8.byteOffset + uint8.byteLength
          )
        : new ArrayBuffer(uint8.byteLength)

    if (buffer instanceof ArrayBuffer) {
      return nativeModule.base64FromArrayBuffer(buffer, urlSafe)
    }
  }

  const buffer =
    uint8.buffer instanceof ArrayBuffer
      ? uint8.buffer
      : new ArrayBuffer(uint8.byteLength)
  return nativeModule.base64FromArrayBuffer(buffer, urlSafe)
}

/**
 * Removes padding characters from base64 string
 */
export const trimBase64Padding = (str: string) => {
  return str.replace(/[.=]{1,2}$/, '')
}
