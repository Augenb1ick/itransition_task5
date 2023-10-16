const BadRequestError = require('../errors/bad-request-err');
const generateFakeData = require('../utills/generateFakeData');

const sendFakeData = (req, res, next) => {
    const { location, seed, page, errRate } = req.params;

    if (!location || !seed || !page || !errRate) {
        return next(
            new BadRequestError(
                'All parameters (location, seed, page, errRate) are required.'
            )
        );
    }

    if (isNaN(seed) || isNaN(page) || isNaN(errRate)) {
        return next(
            new BadRequestError(
                'Seed, page, and errRate must be valid numbers.'
            )
        );
    }

    try {
        const users = generateFakeData(location, seed, page, errRate);
        return res.send(users);
    } catch (err) {
        return next(err);
    }
};

module.exports = sendFakeData;
