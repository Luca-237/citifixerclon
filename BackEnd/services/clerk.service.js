const User = require('../models/user');
const Role = require('../models/role');

/**
 * Crea o actualiza el usuario local a partir de los datos de Clerk (login/registro).
 * Si existe un usuario pre-creado por el admin con ese email (sin clerkId), lo
 * vincula; si es nuevo, le asigna el rol `user` por defecto.
 *
 * @param {Object} data
 * @param {string} data.clerkId    ID del usuario en Clerk.
 * @param {string} data.email      Email del usuario.
 * @param {string} [data.firstName] Nombre.
 * @param {string} [data.lastName]  Apellido.
 * @param {string} [data.imageUrl]  URL del avatar.
 * @param {string} [data.dni]       DNI (si viene).
 * @returns {Promise<Object>} Usuario creado/actualizado (rol poblado).
 * @throws {Error} 500 si no existe el rol `user` por defecto (falta correr el seed).
 */
const upsertUser = async ({ clerkId, email, firstName, lastName, imageUrl, dni }) => {
  // Primero busca por clerkId (login normal)
  let existingUser = await User.findOne({ clerkId });

  // Si no encuentra, busca un usuario pre-creado por el admin con ese email
  if (!existingUser) {
    const preCreated = await User.findOne({ email, clerkId: null });
    if (preCreated) {
      return await User.findByIdAndUpdate(
        preCreated._id,
        {
          $set: {
            clerkId,
            ...(firstName && { firstName }),
            ...(lastName && { lastName }),
            ...(imageUrl && { imageUrl })
          }
        },
        { returnDocument: 'after' }
      ).populate('role');
    }
  }

  const updateFields = { clerkId, email, firstName, lastName, ...(imageUrl && { imageUrl }) };

  if (existingUser) {
    updateFields.role = existingUser.role;
  } else {
    const userRole = await Role.findOne({ name: 'user' });
    if (!userRole) {
      throw Object.assign(new Error('Rol por defecto no encontrado. Asegurate de haber corrido el seed.'), { status: 500 });
    }
    updateFields.role = userRole._id;
  }

  return await User.findOneAndUpdate(
    { clerkId },
    { $set: updateFields },
    { upsert: true, returnDocument: 'after' }
  ).populate('role');
};

module.exports = { upsertUser };