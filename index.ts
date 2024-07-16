import { createSign } from "crypto";
import { KEYUTIL, KJUR, hextob64 } from "jsrsasign";

const pk =
  "MIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQC08LHqTIso0+yaVzwv5Ydsd9w6Af5mr7BA2wcTAaP7TwV2FfzHGFPREOQ4qNmyieTAWMrNf3Qph8dBhR92U/54v5EraZDBha3RJwnFJi1WrgE41qMiM97GKEq6GwErnz5vNxZM32qnEHlxhEiw0Y1dLdE6N3KnMR8SFCGlxsyEyXYqZe68hAxBDbn6P+yf5KkOoOWzI2hTxjEUNYd1l6+nlGZECmU8xt+jDZPlWhNn5oXqAGfi2YXa+El/tmtlrH6x71vARl47pmj51JrsbMiTTkD6QoAgT923VxkRf8GjSndqP1j5vMjD7VvectNfSav+pQWzEVbFYLRm9Y0EEr3LAgMBAAECgf8e6omyRTzZXeXZcayzbyOiYyY6syk4SQyP96L4FbBEJHp9bRXdS+DMUWptfyezVNNPKSlkYpQPzv5ZJuiczUeZzxPjrGGBh+5YLA5vsTUcJdvIbGi+hX3gwKkWjedD+ceGAa0jHNDlK7z4R4IcINVLUVn4/XndkLKrJJQPEEoVTDDuRl82ZWTKJvGN/emcaEEDWo4sDqhgLVLXi4WVU6cQDTHzlkmfG+7kNfglHueaPAlEKhtjrQxLG1XGy4jPVaZCvpcy1xAts9Btuc/XAi3ZQnqUXzg4rJnB8QA20a9vKEiq+lUslMkLcQk42aITuBs/9VEsGEKCc74QtwX7tHECgYEA+jdaoi3xL+YWGfE430xwzvO9rLrrMCOv49w9e+xcBrv5+196Z7rNC6ogBDMoqsO33K3ZCnWT9YOFs/5QXuW2QDZjqfHjOWMbXL9eVzqzLxDGOeVSUMwpMXMMRzNBNZzNXI5qYeUKmBix7BDSwG9qBE+1Q41MtE0EWbeiHSRgdF0CgYEAuR9nCxp1LheHJCJEsgseSnZXVBnkIkuHCQb0QXd7hTPlpa6w03xCSFa4xhR+qWTQ7V9wcx1e1JwCFRNwmz02iCCdJH//511Ez3mwMhi+K63cse+/2awBBYl5t58tiVj4p0NFnuBpOaHimo6R1nji1OItG9g0bOAhLymJPAV02EcCgYEA4BEx2InLslkY8aJSi6SoYKtk74lzk2hh2msfpBnFT0KGWdTmiH1/oTJ3+UrW4BTkUXpdIkCofvOIh+b1kgWjb11FYqp6EKnvlt7IXNT0IPGkkbQKQtCREvczx47elmQUgw4FtiSlmA6FRiDKmgkrpzC54gRm7A8MFkuboP0yYwECgYBDEpaiFj74qTukouni3FZoQkJXzV2z80uEwMlE4waU932wLwAQUAgv74PY+Nn/g/CS4K58dtrCC5hRjI6TIHWekrp83AebC1cAGSX2sLJOXxsEOUp4knJ4UBwSpJC6H8tPxvb1nndhkz7oItnCLGB7I0uWuBoejIJZdSIs5gk0xwKBgHP2fGKQGeKjqxHVy+7NGydUPkf9Bia7h52uWU/PiQSb4++Yzb7pV5Q+YFb7o8lvCsa37c62Mp4cBXn8H/HQ02kyNoMuVmIwDLsoiIDZN0t8hoKVAV6EOGyg4ymGvHl5SLd3cfmlIz3yhw3eSL14ejEhCPDHldQnr6AAhWnQ0Vnj";

const message = "Hello, world";

const viaCrypto = (privateKey: string, source: string): string => {
  const sign = createSign("RSA-SHA512");
  sign.write(source);
  sign.end();

  return sign.sign(
    `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`,
    "base64"
  );
};

const viaJsrsasign = (privateKey: string, source: string): string => {
  const sig = new KJUR.crypto.Signature({ alg: "SHA512withRSA" });
  sig.init(
    KEYUTIL.getKey(
      `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----`
    )
  );
  sig.updateString(source);
  const signatureHex = sig.sign();
  const signatureBase64 = hextob64(signatureHex);

  return signatureBase64;
};

console.log(viaCrypto(pk, message) === viaJsrsasign(pk, message));
