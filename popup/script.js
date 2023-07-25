// script.js
    
setInterval(() => {
  const nextT = Math.ceil(Date.now() / 1000 / 30) * 30000
  const ts = Date.now()

  let progress = 100 - (((nextT - ts) / 30000) * 100);

  updateCode()

  if (progress > 100) {
    progress = 0;
  }

  $('#time').html(new Date().toLocaleString())

  $('#progress').css('width', `${progress}%`)
}, 500);

// 时间戳计数器

function updateCode() {
  const T = Math.floor(Date.now() / 1000 / 30)
  // 用户密钥
  const K = arrayToBinary(Array.from(new Uint8Array(base32Decode('JVIJOPGAHW3367XA'.toUpperCase(), 'RFC4648'))))

  /**
  * 数字转 Int64 字节流
  * @param {number} num 
  * @returns 
  */
  function intToBytes(num) {
    const bytes = [];

    for (let i = 7; i >= 0; i--) {
      bytes[i] = num & 255;
      num = num >> 8;
    }

    return bytes;
  }

  /**
   * @param {string} binaryStr
   */
  function binaryToArray(binaryStr) {
    return binaryStr.split('').map(char => char.charCodeAt())
  }

  function arrayToBinary(array) {
    return array.map(char => String.fromCodePoint(char)).join('')
  }

  function arrayToHex(array) {
    return array.map(char => char.toString(16)).join('')
  }

  const T1 = arrayToBinary(intToBytes(T))
  
  // 计算 HMAC-SHA1，密钥为 K，消息为 T
  const HS = binaryToArray(CryptoJS.HmacSHA1(CryptoJS.enc.Latin1.parse(T1), CryptoJS.enc.Latin1.parse(K)).toString(CryptoJS.enc.Latin1))

  // 取出最后个字节的低 4 位
  const offset = HS[19] & 0xf

  // 将从 offset 开始的四个字节按大端组装为整数
  let bytes = (HS[offset] & 0x7f /** 这里是为了忽略符号位 */) << 24
    | HS[offset + 1] << 16
    | HS[offset + 2] << 8
    | HS[offset + 3]

  // 整数转字符串，然后取出后六位
  let code = bytes.toString().slice(-6);

  // 不足 6 位数则补 0
  for (let i = 0; i > 6 - code.length; i++) {
    code = '0' + code;
  }
  document.getElementById("otfp-code").value = code;


}

updateCode()