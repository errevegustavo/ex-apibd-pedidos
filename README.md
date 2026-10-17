# Proyecto Final: Examen Final

**Taller de Plataformas Web**  
**Tema:** Implementación y validación CRUD API REST hacia BD
**Integrante:** Gustavo Rojas V.  

---

## 1. Enlace al repositorio en GitHub

**Repositorio público del proyecto:**
- **URL del repositorio:** (https://github.com/errevegustavo/aiep26-api-usuarios)

---

## 2. Descripción del entorno de laboratorio

- Se generó repo público en Github.
- Para el entorno de pruiebas se preparó proyecto Node.js
- Para la BD se optó por SQLite y se creó la tabla "Usuario" (db.js).
- Se levantó servidor con Express (index.js) y se estableció conexión hacia BD (db.js).

## 3. Modelo de datos relacional

El sistema está compuesto por dos entidades relacionales vinculadas mediante una FOREIGN KEY: `Cliente` y `Pedido`.

### 3.1. Tabla Cliente

| Campo | Tipo de dato | Descripción |
| :--- | :--- | :--- |
| `id_cliente` | `INTEGER` | Clave primaria autoincremental. |
| `nombre` | `TEXT` | Nombre del cliente. Campo obligatorio (`NOT NULL`). |
| `email` | `TEXT` | Correo electrónico obligatorio y único (`NOT NULL UNIQUE`). |

### 3.2. Tabla Pedido

| Campo | Tipo de dato | Descripción |
| :--- | :--- | :--- |
| `id_pedido` | `INTEGER` | Clave primaria autoincremental. |
| `id_cliente` | `INTEGER` | Llave foránea que referencia a `Cliente(id_cliente)`. |
| `fecha_pedido` | `DATETIME` | Fecha y hora de creación. Por defecto, utiliza `CURRENT_TIMESTAMP`. |
| `total` | `REAL` | Monto total obligatorio, con la restricción `CHECK (total > 0)`. |
| `estado` | `TEXT` | Estado del pedido, con los valores permitidos `Pendiente` y `Completado`. |

### Relación entre las tablas
La tabla `Pedido` se relaciona con la tabla `Cliente` mediante el campo `id_cliente`. Esta relación permite asociar cada pedido con un cliente existente y mantener la integridad referencial de los datos.

---

## 4. Descripción de las pruebas de funcionamiento CRUD (API REST):

Se realizaron pruebas a los 4 endpoints requeridos utilizando cURL desde la CLI confirmando la correcta comunicación con la base de datos SQLIte local:

### 4.1. READ — Consultar pedidos
**Endpoint:** `GET /api/pedidos`  
**Descripción:** Recupera los pedidos registrados en la base de datos, combinando la información de las tablas `Pedido` y `Cliente` mediante una consulta `INNER JOIN`.

**Comando cURL:**
```bash
curl -i http://localhost:3000/api/pedidos
```

**Respuesta esperada (200 OK):**
```json
[
  {
    "id_pedido": 1,
    "fecha_pedido": "2026-10-16 23:26:26",
    "total": 150.5,
    "estado": "Completado",
    "id_cliente": 1,
    "cliente": "Gustavo Vera",
    "email_cliente": "gvera@aiep.cl"
  }
]
```

### 4.2. CREATE — Crear un pedido
**Endpoint:** `POST /api/pedidos`  
**Descripción:** Registra un nuevo pedido asociado a un cliente existente. Se valida que el campo `total` sea mayor que cero y que el `id_cliente` corresponda a un cliente válido.

**Comando cURL (inserción exitosa):**
```bash
curl -i -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{"id_cliente": 1, "total": 299.99, "estado": "Pendiente"}'
```

**Respuesta esperada (201 Created):**
```json
{
  "mensaje": "Pedido creado exitosamente",
  "pedido": {
    "id_pedido": 4,
    "id_cliente": 1,
    "total": 299.99,
    "estado": "Pendiente"
  }
}
```

**Validaciones y manejo de errores:**
- **Monto inválido:** si `total` es menor o igual a cero, se devuelve `400 Bad Request`, con el mensaje *"El total debe ser un número estrictamente mayor a 0"*.
- **Cliente inexistente:** si `id_cliente` no corresponde a un cliente registrado, se devuelve `404 Not Found`, con un mensaje que identifica el ID del cliente inexistente.

### 4.3. UPDATE — Actualizar un pedido
**Endpoint:** `PUT /api/pedidos/:id`  
**Descripción:** Actualiza los datos de un pedido específico, identificado mediante su `id_pedido`. En esta prueba se modifican el estado y el monto total.

**Comando cURL:**
```bash
curl -i -X PUT http://localhost:3000/api/pedidos/4 \
  -H "Content-Type: application/json" \
  -d '{"estado": "Completado", "total": 350.00}'
```

**Respuesta esperada (200 OK):**
```json
{
  "mensaje": "Pedido actualizado correctamente",
  "pedido": {
    "id_pedido": 4,
    "total": 350,
    "estado": "Completado"
  }
}
```

### 4.4. DELETE — Eliminar un pedido
**Endpoint:** `DELETE /api/pedidos/:id`  
**Descripción:** Elimina de la base de datos el pedido identificado mediante su `id_pedido`.

**Comando cURL:**
```bash
curl -i -X DELETE http://localhost:3000/api/pedidos/4
```

**Respuesta esperada (200 OK):**
```json
{
  "mensaje": "Pedido con ID 4 eliminado exitosamente"
}
```

**Verificación de la eliminación:**  
Después de eliminar el pedido, se realiza una consulta para comprobar que el registro ya no existe.

```bash
curl -i http://localhost:3000/api/pedidos/9
```
**Resultado esperado:** `404 Not Found`, lo que confirma que el pedido no se encuentra registrado.

---

## 5. Pasos para la ejecución local

Para ejecutar el proyecto en un entorno local, se deben seguir los siguientes pasos.

**Paso 1. Clonar el repositorio**
```bash
git clone [https://github.com/errevegustavo/aiep26-api-usuarios.git](https://github.com/errevegustavo/aiep26-api-usuarios.git)
cd aiep26-api-usuarios
```

**Paso 2. Instalar las dependencias**
```bash
npm install
```

**Paso 3. Inicializar la base de datos**
```bash
npm run init-db
```
Este comando inicializa la base de datos de acuerdo con la configuración definida en el proyecto.

**Paso 4. Iniciar el servidor**
```bash
npm start
```
Una vez iniciado el servidor, la API estará disponible localmente en: `http://localhost:3000`

---

## 6. Medidas de seguridad y buenas prácticas de backend

Durante el desarrollo se consideraron las siguientes medidas de seguridad y buenas prácticas:

1. **Consultas parametrizadas (Prepared Statements):** se utilizan marcadores de posición (`?`) en las consultas SQL para reducir riesgo de ataques de inyección SQL.
2. **Validación de datos en el servidor:** se validan los tipos de datos, los montos mayores que cero y la existencia de las referencias a clientes antes de registrar o actualizar pedidos.
3. **Integridad referencial:** se utilizan llaves foráneas para mantener la relación entre las tablas `Cliente` y `Pedido`.
4. **Manejo de códigos de estado HTTP:** se emplean códigos de respuesta apropiados para comunicar el resultado de las operaciones, entre ellos:
   - `200 OK`: operación realizada correctamente.
   - `201 Created`: recurso creado correctamente.
   - `400 Bad Request`: solicitud o datos inválidos.
   - `404 Not Found`: recurso no encontrado.
   - `500 Internal Server Error`: error interno del servidor.
5. **Protección de archivos sensibles y temporales:** se utiliza `.gitignore` para evitar subir archivos innecesarios o sensibles al repositorio Publico, como `node_modules/`, `.env` y`.sqlite`.

---

## 7. Conclusiones

El proyecto permitió implementar y probar una API REST  utilizando Node.js, Express y SQLite3, permitiendo operaciones de CRUD de registros.

Además, se trabajó con un modelo de datos relacional, validaciones en el backend, integridad referencial, manejo de códigos de estado HTTP y consultas parametrizadas.

Las pruebas realizadas mediante cURL permiten verificar el comportamiento de los endpoints y comprobar las respuestas de la API ante operaciones exitosas y situaciones de error.
