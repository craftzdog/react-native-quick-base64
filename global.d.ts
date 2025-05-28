declare global {
  var base64ToArrayBuffer: FuncBase64ToArrayBuffer
  var base64FromArrayBuffer: FuncBase64FromArrayBuffer
  var btoa: (data: string) => string
  var atob: (b64: string) => string
}

type FuncBase64ToArrayBuffer = (
  data: string,
  removeLinebreaks?: boolean
) => ArrayBuffer

type FuncBase64FromArrayBuffer = (
  data: string | ArrayBuffer,
  urlSafe?: boolean
) => string

declare var base64ToArrayBuffer: FuncBase64ToArrayBuffer
declare const base64FromArrayBuffer: FuncBase64FromArrayBuffer

export {}
