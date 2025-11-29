require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const orderRoutes = require('./src/routes/orderRoutes');
const errorHandler = require('./src/middlewares/errorHandler');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


app.use('/order', orderRoutes);


app.use(errorHandler);


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));