import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import quotesRoutes from './routes/quotesRoutes';

const app = express();

app.use(express.json());
app.use("/quotes", quotesRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})