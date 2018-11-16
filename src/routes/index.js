const listRoutes = [
  'auth',
  'permissions',
  'roles',
  'users',
];
const getRoute = (route) => require(`./${route}`);
const routes = () => listRoutes.map(route => getRoute(route));

module.exports = routes;
