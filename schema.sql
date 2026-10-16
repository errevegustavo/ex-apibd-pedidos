-- Activar el soporte de llaves foráneas en SQLite
PRAGMA foreign_keys = ON;

-- Eliminar tablas si existen (útil para reinicializar en pruebas)
DROP TABLE IF EXISTS Pedido;
DROP TABLE IF EXISTS Cliente;

-- 1. Creación de la tabla Cliente
CREATE TABLE Cliente (
  id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

-- 2. Creación de la tabla Pedido
CREATE TABLE Pedido (
  id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
  id_cliente INTEGER NOT NULL,
  fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
  total REAL NOT NULL CHECK (total > 0),
  estado TEXT NOT NULL DEFAULT 'Pendiente',
  FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE CASCADE
);

-- 3. Inserción de datos iniciales de prueba (DML)
INSERT INTO Cliente (nombre, email) VALUES 
  ('Gustavo Vera', 'gvera@aiep.cl'),
  ('Dante Rojas', 'drojas@examenfinal.cl');

INSERT INTO Pedido (id_cliente, total, estado) VALUES 
  (1, 150.50, 'Completado'),
  (1, 89.99, 'Pendiente'),
  (2, 299.00, 'Pendiente');