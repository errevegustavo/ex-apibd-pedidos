const db = require('../config/database');

// GET /api/pedidos - Obtener todos los pedidos
exports.obtenerPedidos = (req, res) => {
  const sql = `
    SELECT p.id_pedido, p.fecha_pedido, p.total, p.estado, 
           c.id_cliente, c.nombre AS cliente, c.email AS email_cliente 
    FROM Pedido p 
    INNER JOIN Cliente c ON p.id_cliente = c.id_cliente 
    ORDER BY p.id_pedido DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error al consultar pedidos', 
        detalle: err.message 
      });
    }
    res.status(200).json(rows);
  });
};

// GET /api/pedidos/:id - Obtener pedido por ID
exports.obtenerPedidoPorId = (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT p.id_pedido, p.fecha_pedido, p.total, p.estado, 
           c.id_cliente, c.nombre AS cliente, c.email AS email_cliente 
    FROM Pedido p 
    INNER JOIN Cliente c ON p.id_cliente = c.id_cliente 
    WHERE p.id_pedido = ?
  `;

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error al obtener el pedido', 
        detalle: err.message 
      });
    }
    if (!row) {
      return res.status(404).json({ error: `El pedido con ID ${id} no existe` });
    }
    res.status(200).json(row);
  });
};

// POST /api/pedidos - Crear nuevo pedido
exports.crearPedido = (req, res) => {
  const { id_cliente, total, estado } = req.body;

  if (!id_cliente || total === undefined) {
    return res.status(400).json({ error: 'id_cliente y total son obligatorios' });
  }

  if (typeof total !== 'number' || total <= 0) {
    return res.status(400).json({ error: 'El total debe ser un número estrictamente mayor a 0' });
  }

  db.get('SELECT id_cliente FROM Cliente WHERE id_cliente = ?', [id_cliente], (err, cliente) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error al verificar cliente', 
        detalle: err.message 
      });
    }
    if (!cliente) {
      return res.status(404).json({ error: `El cliente con ID ${id_cliente} no existe` });
    }

    const estadoFinal = estado || 'Pendiente';
    const sql = 'INSERT INTO Pedido (id_cliente, total, estado) VALUES (?, ?, ?)';

    db.run(sql, [id_cliente, total, estadoFinal], function (err) {
      if (err) {
        return res.status(500).json({ 
          error: 'Error al registrar pedido', 
          detalle: err.message 
        });
      }
      res.status(201).json({ 
        mensaje: 'Pedido creado exitosamente', 
        pedido: { 
          id_pedido: this.lastID, 
          id_cliente, 
          total, 
          estado: estadoFinal 
        } 
      });
    });
  });
};

// PUT /api/pedidos/:id - Actualizar estado o total de un pedido
exports.actualizarPedido = (req, res) => {
  const { id } = req.params;
  const { total, estado } = req.body;

  if (total !== undefined && (typeof total !== 'number' || total <= 0)) {
    return res.status(400).json({ error: 'Si se proporciona total, debe ser mayor a 0' });
  }

  db.get('SELECT * FROM Pedido WHERE id_pedido = ?', [id], (err, pedido) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Error al consultar pedido', 
        detalle: err.message 
      });
    }
    if (!pedido) {
      return res.status(404).json({ error: `El pedido con ID ${id} no existe` });
    }

    const nuevoTotal = total !== undefined ? total : pedido.total;
    const nuevoEstado = estado || pedido.estado;
    const sql = 'UPDATE Pedido SET total = ?, estado = ? WHERE id_pedido = ?';

    db.run(sql, [nuevoTotal, nuevoEstado, id], function (err) {
      if (err) {
        return res.status(500).json({ 
          error: 'Error al actualizar pedido', 
          detalle: err.message 
        });
      }
      res.status(200).json({ 
        mensaje: 'Pedido actualizado correctamente', 
        pedido: { 
          id_pedido: Number(id), 
          total: nuevoTotal, 
          estado: nuevoEstado 
        } 
      });
    });
  });
};

// DELETE /api/pedidos/:id - Eliminar pedido
exports.eliminarPedido = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM Pedido WHERE id_pedido = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ 
        error: 'Error al eliminar pedido', 
        detalle: err.message 
      });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: `El pedido con ID ${id} no existe` });
    }
    res.status(200).json({ mensaje: `Pedido con ID ${id} eliminado exitosamente` });
  });
};