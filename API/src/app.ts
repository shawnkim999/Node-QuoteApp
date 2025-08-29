import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import quotesRoutes from './routes/quotesRoutes';

const app = express();
app.use(cors())

app.use(express.json());
app.use("/quotes", quotesRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})