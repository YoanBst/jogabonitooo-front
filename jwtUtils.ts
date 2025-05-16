import jwt from 'jsonwebtoken';

// Clé secrète pour signer le JWT (à ne pas partager publiquement)
const secret = "tonSecretSuperSecret";

// Fonction pour créer un JWT
export const createJWT = (username: string): string => {
  const payload = { username };

  // Génère un token signé, algorithme HS512
  const token = jwt.sign(payload, secret, { algorithm: "HS512" });
  return token;
};

// Fonction pour vérifier et décoder un JWT
export const verifyJWT = (token: string): any => {
  try {
    const decoded = jwt.verify(token, secret, { algorithms: ["HS512"] });
    return decoded;
  } catch (err) {
    console.error("Token invalide :", err);
    return null;
  }
};

