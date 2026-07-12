const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const tripRoutes = require('./routes/tripRoutes');
const driverRoutes = require('./routes/driverRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const logRoutes = require('./routes/logRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const reportRoutes = require('./routes/reportRoutes');

dotenv.config();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/trips', tripRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/reports', reportRoutes);
app.use('/drivers', driverRoutes);
app.use('/maintenance', maintenanceRoutes);
app.use('/logs', logRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});