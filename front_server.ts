import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";


import { Context } from "https://deno.land/x/oak/mod.ts";
// Fonction pour créer le JWT (par exemple, dans un fichier séparé)
import { createJWT } from './jwtUtils.ts';

const app = new Application();
const ROOT = `${Deno.cwd()}/public`;



//Middleware principal, qui sert les fichiers statiques
app.use(async (ctx) => {
  try {
    await ctx.send({
      root: ROOT,
      path: ctx.request.url.pathname,
      index: "HTML/login.html",
    });
  } catch { // Si le fichier n'est pas trouvé, on renvoie une erreur 404
    ctx.response.status = 404;
    ctx.response.body = "404 File not found";
  }
});



// On vérifie que l'user a bien mis le port
if (Deno.args.length < 1) {
  console.log(`Usage: $ deno run --allow-net --allow-read=./ server.ts PORT [CERT_PATH KEY_PATH]`);
  Deno.exit();
}









const loginHandler = async (ctx: Context) => {
  const { username, password } = await ctx.request.body().value;

  const isPasswordValid = checkPassword(username, password);  // A adapter avec ta logique

  if (isPasswordValid) {
    // Crée le JWT
    const token = await createJWT(username);

    // Envoi du token JWT dans un cookie
    ctx.cookies.set("jwt", token, {
      httpOnly: true,
      secure: true, // N'oublie pas de définir secure à true si tu utilises HTTPS
      sameSite: "Strict",  // Empêche les attaques CSRF
      maxAge: 60 * 60 * 24, // Le cookie sera valable 24 heures
    });

    ctx.response.body = { message: "Login successful", token }; // Réponse de succès
  } else {
    ctx.response.status = 401;
    ctx.response.body = { message: "Invalid username or password" };
  }
};


const checkAuth = (ctx: Context, next: Function) => {
  const token = ctx.cookies.get("jwt");

  if (!token) {
    ctx.response.redirect("/login"); // Redirige si le token est absent
  } else {
    try {
      const decoded = decodeJWT(token);  // Décode et vérifie le token
      if (decoded) {
        return next(); // Si le token est valide, on continue
      }
    } catch (error) {
      ctx.response.redirect("/login"); // Redirige si le token est invalide
    }
  }
};



const options = {port: Deno.args[0]}

// Lance https
// Prend 3 paramètres : port, certificate et clé 
if (Deno.args.length >= 3) {
  options.secure = true
  options.cert = await Deno.readTextFile(Deno.args[1])
  options.key = await Deno.readTextFile(Deno.args[2])
  console.log(`SSL conf ready (use https)`);
}



// on lance le serveur
console.log(`Oak static server running on port ${options.port} for the files in ${ROOT}`);
await app.listen({ port: 8000, secure: true, certFile: "../BackEnd/cert.pem", keyFile: "../BackEnd/key.pem" });