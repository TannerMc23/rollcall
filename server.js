require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const tireRoutes = require('./routes/tireRoutes');
const saleRoutes = require('./routes/saleRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.redirect('/dashboard'));

app.use(authRoutes);
app.use(dashboardRoutes);
app.use(tireRoutes);
app.use(saleRoutes);

app.use((req, res) => res.status(404).send('Page not found.'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`RollCall is running on port ${PORT}`));
