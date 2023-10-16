const router = require('express').Router();
const NotFoundError = require('../errors/not-found-err');
const sendFakeData = require('../controllers/fakeData');

router.get('/generate/:location/:seed/:page/:errRate', sendFakeData);

router.use('/*', (req, res, next) =>
    next(new NotFoundError('Route does not exist.'))
);

module.exports = router;
