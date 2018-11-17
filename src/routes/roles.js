import express from 'express';
import role from '../controllers/roleController'
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
    role.create)
  .get('/roles/:id',
    mw.checkResourceExists(mod.Role),
    mw.verifyAccessToken,
    mw.hasPermission(["read-roles"]),
    role.read)
  .get('/roles',
    mw.verifyAccessToken,
    mw.hasPermission(["list-roles"]),
    role.list)
  .put('/roles/:id/',
    mw.checkResourceExists(mod.Role),
    mw.verifyAccessToken,
    mw.hasPermission(["update-roles"]),
    validate(val.role.update),
    role.update)
  .delete('/roles/:id/',
    mw.checkResourceExists(mod.Role),
    mw.verifyAccessToken,
    mw.hasPermission(["delete-roles"]),
    role.remove)
  .put('/roles/:id/add_permissions',
    mw.checkResourceExists(mod.Role),
    mw.verifyAccessToken,
    mw.hasPermission(["assign-permissions-to-role"]),
    validate(val.role.addOrRemovePermission),
    role.addPermission)
  .delete('/roles/:id/remove_permissions',
    mw.checkResourceExists(mod.Role),
    mw.verifyAccessToken,
    mw.hasPermission(["remove-permissions-from-role"]),
    validate(val.role.addOrRemovePermission),
    role.deletePermission);

module.exports = router;
