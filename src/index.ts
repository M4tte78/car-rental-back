import express from 'express';
import path from 'path';
import cors from 'cors';
import sequelize from './config/database';
import carRoutes from './routes/car.routes';
import fs from 'fs';
import './models/car.model';



// 👉 importer les modèles pour qu'ils s'enregistrent correctement
import './models/car.model';





const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(uploadsDir));
app.use('/api/cars', carRoutes);

// ✅ synchronise les modèles déjà initialisés via .init()
sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Unable to sync database:', error);
});
