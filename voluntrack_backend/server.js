const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const svRoutes = require('./routes/svRoutes');
const vRoutes = require('./routes/vRoutes');
const pRoutes = require('./routes/pRoutes');
const tRoutes = require('./routes/tRoutes');
const fRoutes = require('./routes/fRoutes');
const aRoutes = require('./routes/aRoutes');
const gRoutes = require('./routes/gRoutes');
const passwordRoutes = require('./routes/passwordRoutes');


const app = express();

app.use(cors());
app.use(express.json());



app.use('/api/auth', authRoutes);
app.use('/api/supervisors', svRoutes);
app.use('/api', vRoutes);
app.use('/api/projects', pRoutes);
app.use('/api/tasks', tRoutes);
app.use('/api', fRoutes);
app.use('/api/attendance', aRoutes);
app.use('/api/grades', gRoutes);
app.use('/api/password', passwordRoutes);








const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
