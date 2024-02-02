const crypto = require('crypto')
const fs = require("fs");
const express = require("express");

const USERS_FILE = "./users.json";

const app = express();

app.use(express.json());

// Crea el archivo json si no lo encuentra y le asigna un array vacio
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

app.post("/users", (req, res) => {
  const newUser = req.body;
  fs.readFile(USERS_FILE, (err, data) => {
    if (err) {
      res.status(500).send("Error al leer el archivo");
      return;
    }
    let users = JSON.parse(data);

    const pwd = crypto.sign('sha256', newUser.password);
    let fullUser = { id: crypto.randomUUID(), ...newUser };
    fullUser[password] = pwd;
    users.push();
    
    fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        res.status(500).send("Error al guardar el usuario");
      } else {
        res.status(200).send("Usuario creado exitosamente");
      }
    });
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
