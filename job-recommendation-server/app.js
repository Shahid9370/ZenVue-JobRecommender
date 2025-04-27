const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const jobRoutes = require('./routes/jobRoutes');
const recommendRoutes = require('./routes/recommendRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

app.use('/api', jobRoutes);
app.use('/api/recommend', upload.any(), recommendRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});