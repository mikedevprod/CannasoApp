import keytar from 'keytar';
import bcrypt from 'bcryptjs';

const DB_NAME = 'NombreDeLaApp';

export const establecerContraseñaDB = async (password) => {
  try {
    // Encriptar la contraseña antes de almacenarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar la contraseña en keytar
    await keytar.setPassword(DB_NAME, 'db-password', hashedPassword);

    console.log('Contraseña de la base de datos configurada correctamente');
  } catch (error) {
    console.error('Error al establecer la contraseña:', error);
    throw new Error('No se pudo establecer la contraseña de la base de datos');
  }
};
