import express from 'express';
import con from '../controllers';
import mw from '../middlewares';
import mod from "../models";
import val from '../validations';
import validate from 'express-validation';

const router = express.Router();
/**
 * Roles
 */
router
  .post('/roles',
    mw.verifyAccessToken,
    validate(val.role.create),
    mw.hasPermission(["create-roles"]),
    con.role.create)
  .get('/roles/:id',
    mw.checkResourceExists(mod.Role),
    mw.verifyAccessToken,
    mw.hasPermission(["read-roles"]),
    con.role.read)
  .get('/roles',
    mw.verifyAccessToken,
    mw.hasPermission(["list-roles"]),
    con.role.list)
  .put('/roles/:id/',
    mw.checkResourceExists(mod.Role),
    mw.verifyAccessToken,
    mw.hasPermission(["update-roles"]),
    validate(val.role.update),
    con.role.update)
  .delete('/roles/:id/',
    mw.checkResourceExists(mod.Role),
    mw.verifyAccessToken,
    mw.hasPermission(["delete-roles"]),
    con.role.remove)
  .put('/roles/:id/add_permissions',
    mw.checkResourceExists(mod.Role),
    mw.verifyAccessToken,
    mw.hasPermission(["assign-permissions-to-role"]),
    validate(val.role.addOrRemovePermission),
    con.role.addPermission)
  .delete('/roles/:id/remove_permissions',
    mw.checkResourceExists(mod.Role),
    mw.verifyAccessToken,
    mw.hasPermission(["remove-permissions-from-role"]),
    validate(val.role.addOrRemovePermission),
    con.role.deletePermission);

module.exports = router;
