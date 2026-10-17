const db = require('../config/database');

// GET /api/clientes - Listar todos los clientes
exports.obtenerClientes = (req, res) => {
  const sql = 'SELECT * FROM Cliente ORDER BY id_cliente DESC';

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error al obtener clientes', 
        detalle: err.message 
      });
    }
    res.status(200).json(rows);
  });
};

// POST /api/clientes - Crear un cliente
exports.crearCliente = (req, res) => {
  const { nombre, email } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ 
      error: 'Los campos nombre y email son obligatorios' 
    });
  }

  const sql = 'INSERT INTO Cliente (nombre, email) VALUES (?, ?)';
  const params = [nombre, email];

  db.run(sql, params, function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ 
          error: 'El email ya se encuentra registrado' 
        });
      }
      return res.status(500).json({ 
        error: 'Error al registrar cliente', 
        detalle: err.message 
      });
    }

    res.status(201).json({
      mensaje: 'Cliente creado exitosamente',
      cliente: { 
        id_cliente: this.lastID, 
        nombre, 
        email 
      }
    });
  });
};