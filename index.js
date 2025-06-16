const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sucursalRoutes = require('./routes/sucursalRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/sucursales', sucursalRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Cinema Service corriendo en puerto ${PORT}`));
