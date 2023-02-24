require('dotenv').config();
import express from 'express';
import cors from 'cors';
import { router } from './routes';

const app = express();

let corsOptions = {
  origin: "https://balance-app-theta.vercel.app/"
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(router);

app.listen(3333, () => console.log(`Server is running on port ${3333}`));