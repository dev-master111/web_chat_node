import resError from '../api/middlewares/res_error';
import resSuccess from '../api/middlewares/res_success';

let multer = require('multer');

let avatarUpload = multer({
  dest: 'uploads/avatar',
  rename: function (fieldname, filename) {
    return filename + Date.now();
  }
});

let env = process.env.NODE_ENV || 'development';

module.exports = function (app, passport) {
  let router = require(`express-promise-router`)();
  app.use(resError);
  app.use(resSuccess);
  router.use(resError);
  router.use(resSuccess);

  /* Message API Endpoints */
  app.use('/api/v1', router);
};