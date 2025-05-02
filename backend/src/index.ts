import express from 'express';
import cors from 'cors';
import path from 'path';

import apiRouter from './api';

const app = express();
const PORT = process.env.PORT ?? 3001;
const staticPath = path.join(__dirname, '../../frontend/dist');

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);

app.use(express.static(staticPath));
// From express v5, using a new format of regex
app.get(/(.*)/, (_req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
