const crypto = require('crypto')
const fs = require('fs');
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sequelize = require('./config');
const User = require('./model');
const UserZod = require('./user_zod');

const app = express();
app.use(express.json());

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
app.post("/users", verifyToken, async (req, res) => {
  let newUser = req.body;
  try {
    UserZod.parse(newUser);
    const pwd = crypto.scryptSync(newUser.password, process.env.SALT, 10);
    newUser.password = pwd.toString("base64");
    const user = await User.create(newUser);

    res.json({
      message: 'Usuario creado',
      data: user
    });
  } catch (error) {
    let msgErrors = [];
    for(e in error.errors){
      msgErrors.push(error.errors[e].message);
    }
    res.status(400).json(msgErrors);
  }
});

/* /users:
 * get:
 *  parameters:
 * Retorna el listado de todos los usuarios
 */
app.get("/users", verifyToken, async(req, res) => {
  const users = await User.findAll();
  res.json(users);
});


/* /login:
 * post:
 *  parameters:
 *    user: Nombre de usuario que desea hacer login
 *    password: Password del usuario
 * 
 */
app.post("/login", async(req, res) => {
  const userIntentLogin = req.body;
  const pwd = crypto.scryptSync(userIntentLogin.password, process.env.SALT, 10);
  const user = await User.findOne({ where: { email: userIntentLogin.email, password: pwd.toString("base64") } });
    
  if (user) {
    const token = jwt.sign(
      { name: user.name, email: user.email },
      process.env.SECRETKEY,
      { expiresIn: '1h', }
    );
    return res.status(200).json({ token });
  }
  else {
    return res.status(404).json({ error: "Usuario invalido" });
  }
});

sequelize.sync({ alter: false }).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`El servidor está escuchando en el puerto ${process.env.PORT}`)
  })
});
