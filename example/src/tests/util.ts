export const mapStr = (arr: string, callback: Function): Uint8Array => {
  let res = new Uint8Array(arr.length)
  let kValue, mappedValue

  for (let k = 0, len = arr.length; k < len; k++) {
    kValue = arr.charAt(k)
    mappedValue = callback(kValue, k, arr)
    res[k] = mappedValue
  }

  return res
}

export const mapArr = (arr: Uint8Array, callback: Function): string => {
  let res: string = ''
  let kValue, mappedValue

  for (let k = 0, len = arr.length; k < len; k++) {
    kValue = arr[k]
    mappedValue = callback(kValue, k, arr)
    res += mappedValue
  }

  return res
}
