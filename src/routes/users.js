import express from 'express';
import con from '../controllers';
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
    con.user.create)
  .get('/users',
    mw.verifyAccessToken,
    mw.hasPermission(["list-users"]),
    con.user.list)
  .get('/users/:id/',
    mw.checkResourceExists(mod.User),
    mw.verifyAccessToken,
    mw.hasPermission(["read-users"]),
    con.user.read)
  .put('/users/:id/',
    mw.checkResourceExists(mod.User),
    mw.verifyAccessToken,
    mw.hasPermission(["update-users"]),
    validate(val.user.update),
    con.user.update)
  .delete('/users/:id/',
    mw.checkResourceExists(mod.User),
    mw.verifyAccessToken,
    mw.hasPermission(["delete-users"]),
    con.user.del)
  .put('/users/:id/add_roles',
    mw.checkResourceExists(mod.User),
    mw.verifyAccessToken,
    mw.hasPermission(["assign-roles-to-user"]),
    validate(val.user.addOrRemoveRole),
    con.user.addRole)
  .delete('/users/:id/remove_roles',
    mw.checkResourceExists(mod.User),
    mw.verifyAccessToken,
    mw.hasPermission(["remove-roles-from-user"]),
    validate(val.user.addOrRemoveRole),
    con.user.deleteRole);

module.exports = router;
