import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'The backend for LLM-Chat is running.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
