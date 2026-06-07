const requireProfileComplete = (req, res, next) => {
  if (!req.dbUser?.profileComplete) {
    return res.status(403).json({
      error: 'Debés completar tu perfil antes de continuar.',
      code: 'PROFILE_INCOMPLETE'
    });
  }
  next();
};

module.exports = { requireProfileComplete };
