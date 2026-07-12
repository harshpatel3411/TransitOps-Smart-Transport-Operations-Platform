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
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api', logRoutes);
app.use('/api/logs', logRoutes);
app.use('/logs', logRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});