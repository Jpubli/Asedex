import express from 'express';
import cors from 'cors';
import path from 'path';
import { promises as fs } from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Adjust this to the URL of your frontend
  credentials: true,
}));
app.use(express.json());

// Configurar multer para el manejo de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Helper function to read JSON file
async function readJsonFile(filename) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    throw error;
  }
}

// Helper function to write JSON file
async function writeJsonFile(filename, data) {
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

// Rutas API
app.get('/api/modules', async (req, res, next) => {
  try {
    const modules = await readJsonFile('modules.json');
    res.json(modules);
  } catch (error) {
    next(error);
  }
});

app.post('/api/modules', upload.single('image'), async (req, res, next) => {
  try {
    const modules = await readJsonFile('modules.json');
    const newModule = {
      id: Date.now(),
      ...req.body,
      price: parseFloat(req.body.price),
    };
    if (req.file) {
      newModule.imageUrl = `/uploads/${req.file.filename}`;
    }
    modules.push(newModule);
    await writeJsonFile('modules.json', modules);
    res.status(201).json(newModule);
  } catch (error) {
    next(error);
  }
});

app.put('/api/modules/:id', upload.single('image'), async (req, res, next) => {
  try {
    const modules = await readJsonFile('modules.json');
    const index = modules.findIndex(m => m.id === parseInt(req.params.id));
    if (index !== -1) {
      modules[index] = { ...modules[index], ...req.body, price: parseFloat(req.body.price) };
      if (req.file) {
        modules[index].imageUrl = `/uploads/${req.file.filename}`;
      }
      await writeJsonFile('modules.json', modules);
      res.json(modules[index]);
    } else {
      res.status(404).json({ message: 'Module not found' });
    }
  } catch (error) {
    next(error);
  }
});

app.delete('/api/modules/:id', async (req, res, next) => {
  try {
    const modules = await readJsonFile('modules.json');
    const filteredModules = modules.filter(m => m.id !== parseInt(req.params.id));
    await writeJsonFile('modules.json', filteredModules);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Rutas para clientes
app.get('/api/clients', async (req, res, next) => {
  try {
    const clients = await readJsonFile('clients.json');
    res.json(clients);
  } catch (error) {
    next(error);
  }
});

app.post('/api/clients', async (req, res, next) => {
  try {
    const clients = await readJsonFile('clients.json');
    const newClient = { id: Date.now(), ...req.body };
    clients.push(newClient);
    await writeJsonFile('clients.json', clients);
    res.status(201).json(newClient);
  } catch (error) {
    next(error);
  }
});

app.put('/api/clients/:id', async (req, res, next) => {
  try {
    const clients = await readJsonFile('clients.json');
    const index = clients.findIndex(c => c.id === parseInt(req.params.id));
    if (index !== -1) {
      clients[index] = { ...clients[index], ...req.body };
      await writeJsonFile('clients.json', clients);
      res.json(clients[index]);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    next(error);
  }
});

app.delete('/api/clients/:id', async (req, res, next) => {
  try {
    const clients = await readJsonFile('clients.json');
    const filteredClients = clients.filter(c => c.id !== parseInt(req.params.id));
    await writeJsonFile('clients.json', filteredClients);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Rutas para presupuestos
app.get('/api/budgets', async (req, res, next) => {
  try {
    const budgets = await readJsonFile('budgets.json');
    res.json(budgets);
  } catch (error) {
    next(error);
  }
});

app.post('/api/budgets', async (req, res, next) => {
  try {
    const budgets = await readJsonFile('budgets.json');
    const newBudget = { id: Date.now(), ...req.body };
    budgets.push(newBudget);
    await writeJsonFile('budgets.json', budgets);
    res.status(201).json(newBudget);
  } catch (error) {
    next(error);
  }
});

app.put('/api/budgets/:id', async (req, res, next) => {
  try {
    const budgets = await readJsonFile('budgets.json');
    const index = budgets.findIndex(b => b.id === parseInt(req.params.id));
    if (index !== -1) {
      budgets[index] = { ...budgets[index], ...req.body };
      await writeJsonFile('budgets.json', budgets);
      res.json(budgets[index]);
    } else {
      res.status(404).json({ message: 'Budget not found' });
    }
  } catch (error) {
    next(error);
  }
});

app.delete('/api/budgets/:id', async (req, res, next) => {
  try {
    const budgets = await readJsonFile('budgets.json');
    const filteredBudgets = budgets.filter(b => b.id !== parseInt(req.params.id));
    await writeJsonFile('budgets.json', filteredBudgets);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Manejar rutas de SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});