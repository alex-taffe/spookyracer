const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Wassup');
});

if (process.env.NODE_ENV === 'development') {
    // only use in development
    app.use(errorHandler());
} else {
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).send('Server Error');
    });
}

app.listen(8000, () => {
    console.log('Server running at localhost:8000...');
});
