import CryptoJS from 'crypto-js'

export const encrypted = (input, secret) =>
    CryptoJS.DES.encrypt(input, secret).toString()

export const decrypted = (input, secret) =>
    CryptoJS.DES.decrypt(input, secret).toString(CryptoJS.enc.Utf8)
