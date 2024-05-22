const db = require('./config/db'); // Ajusta la ruta según tu configuración
const bcrypt = require('bcrypt');

const saltRounds = 10;

db.query('SELECT * FROM usuarios', async (err, results) => {
  if (err) {
    console.error('Error al realizar la consulta:', err);
    return;
  }

  for (const user of results) {
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    db.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashedPassword, user.id], (err, res) => {
      if (err) {
        console.error(`Error al actualizar la contraseña para el usuario ${user.id}:`, err);
      } else {
        console.log(`Contraseña actualizada para el usuario ${user.id}`);
      }
    });
  }
});