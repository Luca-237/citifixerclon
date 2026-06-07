const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const User = require('../models/user');

let _io = null;
const getIo = () => _io;

const setupSocket = (io) => {
  _io = io;
  // Middleware de autenticación — corre antes de cada conexión
  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || '');
      const token = cookies.auth_token;

      if (!token) return next(new Error('No autorizado'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ clerkId: decoded.sub }).select('_id');

      if (!user) return next(new Error('Usuario no encontrado'));

      socket.userId = user._id.toString();
      next();
    } catch {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    // Cada usuario entra a su room personal
    socket.join(`user_${socket.userId}`);
    console.log(`[socket] usuario ${socket.userId} conectado`);

    socket.on('disconnect', () => {
      console.log(`[socket] usuario ${socket.userId} desconectado`);
    });
  });
};

module.exports = { setupSocket, getIo };
