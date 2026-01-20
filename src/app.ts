import express from 'express';;
import { errorHandler } from './middlewares/errorHandler';
import config from './config/config';

// Routes
import characterRoutes from './routes/character/character.routes';
import userRoutes from './routes/user/user.routes';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/character', characterRoutes);
app.use('/user', userRoutes);

// User middlewares
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});