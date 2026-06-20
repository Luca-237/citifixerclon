const { getAuth } = require('@clerk/express');
const jwt = require('jsonwebtoken');

const verifyTokenAndSetCookie = [
  // 1. Verifica el token de Clerk (solo en el login)
  (req, res, next) => {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'No autorizado o token inválido' });
    }
    req.clerkUserId = userId;
    next();
  },

  // 2. Genera el JWT propio del back y lo guarda en cookie
  (req, res, next) => {
    const sessionToken = jwt.sign(
      { sub: req.clerkUserId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('auth_token', sessionToken, {
      httpOnly: true,
      // En producción DEBE ser true para que el navegador acepte SameSite 'none'
      secure: isProduction, 
      // 'none' permite que la cookie viaje de Vercel a Render. Localmente sigue usando 'lax'
      sameSite: isProduction ? 'none' : 'lax', 
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
    });

    next();
  }
];

module.exports = verifyTokenAndSetCookie;
