function b64ToBytes(b64: string) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function getSubtleOrNull() {
  return globalThis.crypto?.subtle ?? null;
}

async function importAesKeyFromBase64(keyBase64: string) {
  const raw = b64ToBytes(keyBase64);
  if (raw.length !== 32) throw new Error("Chave inválida: precisa ter 32 bytes (base64)");

  const subtle = getSubtleOrNull();
  if (!subtle) return null;

  return subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["decrypt"]);
}

export async function decryptApiResponse<T = any>(payload: any): Promise<T> {
  if (!payload?.encrypted) return payload as T;

  const subtle = getSubtleOrNull();
  if (!subtle) {
    throw new Error(
      "WebCrypto indisponível (crypto.subtle). Em HTTP (IP/Safari) não dá pra descriptografar. Desative a criptografia no DEV ou use HTTPS."
    );
  }

  const keyBase64 = import.meta.env.VITE_RESPONSE_ENC_KEY_BASE64 as string;
  if (!keyBase64) throw new Error("VITE_RESPONSE_ENC_KEY_BASE64 não definido no front");

  const key = await importAesKeyFromBase64(keyBase64);
  if (!key) throw new Error("WebCrypto indisponível (crypto.subtle).");

  const iv = b64ToBytes(payload.iv);
  const tag = b64ToBytes(payload.tag);
  const data = b64ToBytes(payload.data);

  const combined = new Uint8Array(data.length + tag.length);
  combined.set(data, 0);
  combined.set(tag, data.length);

  const decrypted = await subtle.decrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    key,
    combined
  );

  const json = new TextDecoder().decode(new Uint8Array(decrypted));
  return JSON.parse(json) as T;
}
