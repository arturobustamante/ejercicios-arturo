const crypto = require('crypto')
const fs = require('fs');
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const USERS_FILE = "./users.json";

const app = express();

app.use(express.json());

// Crea el archivo json si no lo encuentra y le asigna un array vacio
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

// Middleware para verificar la valides del token, la funcion jwt.verify ademas de validar
// el valor del token verifica que el token no haya expirado
function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Acceso denegado" });
  try {
    jwt.verify(token, process.env.SECRETKEY);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};


/* /users:
 * post:
 *  parameters:
 *    user: Nombre de usuario a registrar
 *    email: Correo del usuario a registrar
 *    password: Password del usuario
 * 
 */
app.post("/users", verifyToken, (req, res) => {
  const newUser = req.body;
  fs.readFile(USERS_FILE, (err, data) => {
    if (err) {
      res.status(500).json({error: "Error al leer el archivo"});
      return;
    }
    let users = JSON.parse(data);

    const pwd = crypto.scryptSync(newUser.password, process.env.SALT, 10);
    let fullUser = { id: crypto.randomUUID(), rol: "guest", ...newUser };
    fullUser["password"] = pwd.toString("base64");
    users.push(fullUser);
    
    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).json({error: "Error al guardar el usuario"});
      } else {
        res.status(200).json({message: "Usuario creado exitosamente"});
      }
    });
  });
});

/* /login:
 * post:
 *  parameters:
 *    user: Nombre de usuario que desea hacer login
 *    password: Password del usuario
 * 
 */
app.post("/login", (req, res) => {
  const userIntentLogin = req.body;
  fs.readFile(USERS_FILE, (err, data) => {
    if (err) {
      res.status(500).json({error: "Error al leer el archivo"});
      return;
    }
    const users = JSON.parse(data);
    const user = users.find((u) => {
      const pwd = crypto.scryptSync(userIntentLogin.password, process.env.SALT, 10);
      if(u.user === userIntentLogin.user && pwd.toString("base64") === u.password) {
        return u;
      }
    }); 
    
    if(user){
      const token = jwt.sign(
        { user: user.user, rol: user.rol },
        process.env.SECRETKEY, 
        { expiresIn: '1h', }
        );
      return res.status(200).json({ token });
    }
    else {
      return res.status(404).jsonr({error: "Usuario invalido"});
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

