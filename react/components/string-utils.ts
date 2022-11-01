export function decodeUrlString(str: string) {
  return str.replace(/\$2F/gi, '/')
}

export function encodeUrlString(str: string) {
  return str.replace(/\//gi, '$2F')
}
