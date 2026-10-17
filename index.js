require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./config/database');
const clienteRoutes = require('./routes/clienteRoutes');
const pedidoRoutes = require('./routes/pedidoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/clientes', clienteRoutes);
app.use('/api/pedidos', pedidoRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ 
    mensaje: 'API REST de Pedidos y Clientes - Examen Final', 
    estado: 'Servidor operativo' 
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${PORT}`);
});