const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Access Denied: Admin privileges required." });
  }
};

module.exports = { isAdmin };