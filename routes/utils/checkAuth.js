var checkAuth = function (req, res, next) {
  if (req.session.authed) {
    next();
  } else {
    var error = new Error('You are not logged in.');
    error.status = 401;
    return next(error);
  }
};

var isAdmin = function (req, res, next) {
  if(req.session.role === 'admin') {
    next();
  } else {
    var error = new Error('This requires more privileges.');
    error.status = 403;
    return next(error);
  }
};

module.exports = {
  checkAuth: checkAuth,
  isAdmin: isAdmin
};

