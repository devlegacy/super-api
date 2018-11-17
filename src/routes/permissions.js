import express from 'express';
import permission from '../controllers/permissionController';
import mw from '../middlewares';
import mod from "../models";
import val from '../validations';
import validate from 'express-validation';

const router = express.Router();
/**
 * Permisos
 */
router
  .post('/permissions',
    mw.verifyAccessToken,
    mw.hasPermission(["create-permissions"]),
    validate(val.permission.create),
    permission.create)
  .get('/permissions/:id',
    mw.checkResourceExists(mod.Permission),
    mw.verifyAccessToken,
    mw.hasPermission(["read-permissions"]),
    permission.read)
  .get('/permissions',
    mw.verifyAccessToken,
    mw.hasPermission(["list-permissions"]),
    permission.list)
  .put('/permissions/:id/',
    mw.checkResourceExists(mod.Permission),
    mw.verifyAccessToken,
    mw.hasPermission(["update-permissions"]),
    validate(val.permission.update),
    permission.update)
  .delete('/permissions/:id/',
    mw.checkResourceExists(mod.Permission),
    mw.verifyAccessToken,
    mw.hasPermission(["delete-permissions"]),
    permission.remove);

module.exports = router;
