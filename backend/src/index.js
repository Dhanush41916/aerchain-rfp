const express = require('express');
const cors = require('cors');
const path = require('path');
const rfpRoutes = require('./routes/rfp');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'aerchain-rfp-backend' });
});

app.use('/api/rfp', rfpRoutes);

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

