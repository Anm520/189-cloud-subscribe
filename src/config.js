import crypto from "crypto";

// 生成一个 32 字节（256 位）的随机密钥
// const SECRET_KEY = crypto.randomBytes(16).toString("hex"); // 32个字符的十六进制字符串
// console.log("生成的密钥:", SECRET_KEY);
export const JWT_SECRET = crypto.randomBytes(32).toString("hex");
// console.log("生成的密钥:", JWT_SECRET);
export const JWT_EXPIRES_IN = "72h";
export const CRYPTO_SECRET_KEY = "4275d4b51bf8fa244c04f0ce119683f0";
