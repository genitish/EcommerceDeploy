const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');
require('dotenv').config();
// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const braintreeRoutes = require('./routes/braintree');
const orderRoutes = require('./routes/order');
const {DATABASE,PORT} = require('./config/keys');

// app
const app = express();

// db
mongoose
    .connect(DATABASE, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('DB Connected'));

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

// routes middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', braintreeRoutes);
app.use('/api', orderRoutes);

//production
if(process.env.NODE_ENV == 'production'){

    const path = require('path')
    const compression = require('compression');
    app.use(compression());
    app.use(express.static(path.join(__dirname, 'build')));

    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
}

const port = PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
