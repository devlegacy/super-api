import express from 'express';
import user from '../controllers/userController';
import mw from '../middlewares';
import mod from "../models";
import val from '../validations';
import validate from 'express-validation';

const router = express.Router();
/**
 * Usuarios
 */
router
  .post('/users',
    mw.verifyAccessToken,
    validate(val.user.create),
    mw.hasPermission(["create-users"]),
    user.create)
  .get('/users',
    mw.verifyAccessToken,
    mw.hasPermission(["list-users"]),
    user.list)
  .get('/users/:id/',
    mw.checkResourceExists(mod.User),
    mw.verifyAccessToken,
    mw.hasPermission(["read-users"]),
    user.read)
  .put('/users/:id/',
    mw.checkResourceExists(mod.User),
    mw.verifyAccessToken,
    mw.hasPermission(["update-users"]),
    // validate(val.user.update),
    user.update)
  .delete('/users/:id/',
    mw.checkResourceExists(mod.User),
    mw.verifyAccessToken,
    mw.hasPermission(["delete-users"]),
    user.del)
  .put('/users/:id/add_roles',
    mw.checkResourceExists(mod.User),
    mw.verifyAccessToken,
    mw.hasPermission(["assign-roles-to-user"]),
    validate(val.user.addOrRemoveRole),
    user.addRole)
  .delete('/users/:id/remove_roles',
    mw.checkResourceExists(mod.User),
    mw.verifyAccessToken,
    mw.hasPermission(["remove-roles-from-user"]),
    validate(val.user.addOrRemoveRole),
    user.deleteRole);

module.exports = router;
