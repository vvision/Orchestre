// Ensure user is authenticated.
var ensureAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
};

// Ensure user is an admin.
var ensureAdmin = function (req, res, next) {
  console.log(req.user);
  if(req.user && req.user.role === 'admin') {
    return next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = {
  ensureAuthenticated: ensureAuthenticated,
  ensureAdmin: ensureAdmin
};

