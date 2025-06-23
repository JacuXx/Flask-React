# StoreApp - Flask + React

## Descripción

StoreApp es una aplicación web full-stack que combina Flask como backend y React como frontend. Esta aplicación permite gestionar un catálogo de productos con funcionalidades CRUD completas, incluyendo la carga de imágenes.

## Características

- **Backend Flask:**
  - API RESTful para gestión de productos
  - Conexión a MongoDB
  - Subida de imágenes
  - CORS habilitado para comunicación con React
  - Categorías de productos

- **Frontend React:**
  - Interfaz de usuario moderna y responsiva
  - Gestión de estado con React Hooks
  - Enrutamiento con React Router
  - Integración con SweetAlert2 para notificaciones
  - Diseño con Bootstrap

## Tecnologías Utilizadas

### Backend
- **Flask** - Framework web de Python
- **PyMongo** - Driver de MongoDB para Python
- **Flask-CORS** - Manejo de CORS
- **MongoDB** - Base de datos NoSQL

### Frontend
- **React 19** - Biblioteca de JavaScript para interfaces de usuario
- **React Router DOM** - Enrutamiento en React
- **Bootstrap/Bootswatch** - Framework CSS
- **SweetAlert2** - Biblioteca para alertas elegantes

## Estructura del Proyecto

```
Flask-React/
├── backend/
│   ├── src/
│   ├── uploads/          # Archivos subidos
│   ├── venv/            # Entorno virtual Python
│   ├── __pycache__/
│   └── app.py           # Aplicación Flask principal
├── StoreApp/
│   └── frontend/
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── README.md
├── .gitignore
└── README.md
```

## Instalación y Configuración

### Prerrequisitos

- Python 3.7+
- Node.js 14+
- MongoDB (ejecutándose en localhost:27017)

### Backend (Flask)

1. Navega al directorio del backend:
   ```bash
   cd backend
   ```

2. Crea y activa un entorno virtual:
   ```bash
   python -m venv venv
   # En Windows:
   venv\Scripts\activate
   # En macOS/Linux:
   source venv/bin/activate
   ```

3. Instala las dependencias:
   ```bash
   pip install flask flask-pymongo flask-cors pymongo
   ```

4. Ejecuta la aplicación:
   ```bash
   python app.py
   ```

   El servidor Flask estará disponible en `http://localhost:5000`

### Frontend (React)

1. Navega al directorio del frontend:
   ```bash
   cd StoreApp/frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Ejecuta la aplicación en modo desarrollo:
   ```bash
   npm start
   ```

   La aplicación React estará disponible en `http://localhost:3000`

## API Endpoints

### Productos

- `GET /products` - Obtener todos los productos
- `POST /products` - Crear un nuevo producto
- `GET /product/<id>` - Obtener un producto específico
- `PUT /product/<id>` - Actualizar un producto
- `DELETE /product/<id>` - Eliminar un producto

### Categorías

- `GET /categories` - Obtener todas las categorías

### Archivos

- `GET /uploads/<filename>` - Servir archivos subidos

## Configuración de la Base de Datos

La aplicación utiliza MongoDB. Asegúrate de que MongoDB esté ejecutándose en tu sistema local en el puerto predeterminado (27017).

La aplicación creará automáticamente:
- Base de datos: `storedb`
- Colecciones: `products` y `categories`

## Funcionalidades

1. **Gestión de Productos:**
   - Crear, leer, actualizar y eliminar productos
   - Subida de imágenes para productos
   - Categorización de productos

2. **Interfaz de Usuario:**
   - Lista de productos con paginación
   - Formularios para crear/editar productos
   - Vista detallada de productos
   - Confirmaciones de eliminación

## Desarrollo

### Scripts Disponibles

#### Frontend
- `npm start` - Ejecuta la aplicación en modo desarrollo
- `npm test` - Ejecuta las pruebas
- `npm run build` - Construye la aplicación para producción
- `npm run eject` - Expone la configuración de Create React App

#### Backend
- `python app.py` - Ejecuta el servidor Flask en modo debug

## Contribución

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactar.

---

**Nota:** Asegúrate de configurar correctamente las variables de entorno y la conexión a la base de datos antes de ejecutar la aplicación en producción.

