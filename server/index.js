import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import clientRoutes from './routes/clientRoutes.js';

dotenv.config();
connectDB();

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/client', clientRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));
