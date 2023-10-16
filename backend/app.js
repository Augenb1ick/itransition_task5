const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 4000 } = process.env;

const app = express();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: ['https://user-registry-seven.vercel.app'],
        credentials: true,
        methods: 'GET, PUT, PATCH, POST, DELETE',
        allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
    })
);

app.use(requestLogger);
app.use('/', require('./routes/index'));

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
