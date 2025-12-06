require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rfpRoutes = require('./routes/rfp');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/rfp', rfpRoutes);

app.get('/', (req, res) => {
  res.send('Backend OK');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


