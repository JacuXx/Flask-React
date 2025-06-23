from flask import Flask, request, jsonify, make_response, send_from_directory
from flask_pymongo import PyMongo
from bson import ObjectId
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)          # Crea un objeto de aplicación Flask

# URI de la base de datos MongoDB que se creará/consumirá
app.config["MONGO_URI"] = "mongodb://localhost/storedb"

# Inicializamos la extensión PyMongo
mongo = PyMongo(app)           # Conexión a la BD
db = mongo.db.products         # Colección que se creará

# Habilitamos CORS para que el cliente (React) pueda hacer peticiones al servidor (Flask)
CORS(app)

# Configuración para subir archivos
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# Crear carpeta si no existe
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Servir archivos subidos
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Función de validación de extensiones
def allowed_file(filename):
     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Ruta para crear un nuevo producto
@app.route('/products', methods=['POST'])
def createProduct():
    # Procesar datos de formulario y archivo
    title = request.form.get('title')
    price = request.form.get('price')
    category = request.form.get('category')
    description = request.form.get('description')
    image_path = None
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            image_path = f'/uploads/{filename}'
    result = db.insert_one({
        'title': title,
        'price': price,
        'category': category,
        'description': description,
        'image': image_path
    })
    return make_response(jsonify({'id': str(result.inserted_id)}), 201)

# Ruta para obtener todos los productos
@app.route('/products', methods=['GET'])
def getProducts():
    products_cursor = db.find()
    products = []
    for p in products_cursor:
        products.append({
            'id': str(p['_id']),
            'title': p.get('title'),
            'price': p.get('price'),
            'category': p.get('category'),
            'description': p.get('description'),
            'image': p.get('image')
        })
    return make_response(jsonify(products), 200)

@app.route('/product/<id>', methods=['GET'])
def getProductById(id):
     p = db.find_one({'_id': ObjectId(id)})
     if not p:
         return make_response(jsonify({'error': 'Product not found'}), 404)
     return make_response(jsonify({
         'id': str(p['_id']),
         'title': p.get('title'),
         'price': p.get('price'),
         'category': p.get('category'),
         'description': p.get('description'),
         'image': p.get('image')
     }), 200)

@app.route('/product/<id>', methods=['DELETE'])
def deleteProduct(id):
    print(f"DELETE endpoint called for id={id}")
    result = db.delete_one({'_id': ObjectId(id)})
    return make_response(jsonify({'num_rows': result.deleted_count}), 200)

# Ruta para obtener catálogo de categorías
@app.route('/categories', methods=['GET'])
def getCategories():
    # Obtener todas las categorías de la colección 'categories'
    categories_cursor = mongo.db.categories.find()
    categories = [c.get('name') for c in categories_cursor]
    return make_response(jsonify(categories), 200)

@app.route('/product/<id>', methods=['PUT'])
def updateProduct(id):
    # Procesar posible nuevo archivo
    update_data = {}
    if 'title' in request.form: update_data['title'] = request.form['title']
    if 'price' in request.form: update_data['price'] = request.form['price']
    if 'category' in request.form: update_data['category'] = request.form['category']
    if 'description' in request.form: update_data['description'] = request.form['description']
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            update_data['image'] = f'/uploads/{filename}'
    product = db.update_one({'_id': ObjectId(id)}, {'$set': update_data})
    return make_response(jsonify({'num_rows': product.modified_count}), 200)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)