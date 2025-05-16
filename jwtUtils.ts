import { create } from "https://deno.land/x/djwt/mod.ts";

// Clé secrète pour signer le JWT (à ne pas partager publiquement)
const secret = "tonSecretSuperSecret";

// Fonction pour créer un JWT
export const createJWT = async (username: string) => {
  const payload = {
    username,
  };

  const jwt = await create(
    { alg: "HS512", key: secret },
    payload
  );
  return jwt;
};

// Fonction pour vérifier et décoder un JWT
import { verify } from "https://deno.land/x/djwt/mod.ts";

export const decodeJWT = async (token: string) => {
  try {
    const decoded = await verify(token, secret, "HS512");
    return decoded;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};
