// src/components/Products.js
import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';

export const Products = () => {
  const URI_API = "http://localhost:5000"; // URI de nuestra API Flask

  const [_id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  // Para almacenar archivo de imagen
  const [imageFile, setImageFile] = useState(null);
  const [price, setPrice] = useState("");
  const [categoriesList, setCategoriesList] = useState([]);
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(false); // true si estamos editando

  /* ———————————————————————————————— CICLO DE VIDA ———————————————————————————————— */
  useEffect(() => {
    getProducts(); // Al cargar la página obtenemos todos los productos
    getCategories(); // y las categorías
  }, []);

  // Cargar catálogo de categorías desde la API
  async function getCategories() {
    try {
      const res = await fetch(`${URI_API}/categories`);
      const data = await res.json();
      setCategoriesList(data);
    } catch (err) {
      console.error(err);
    }
  }

  /* ———————————————————————————————— HANDLERS ———————————————————————————————— */
  const handleSubmit = (e) => {
    e.preventDefault();
    saveProduct();
  };

  /* ————————————————————————— CRUD (fetch API) ————————————————————————— */
  // Crear o actualizar un producto
  async function saveProduct() {
    if (!editing) {
      // INSERT
      // Enviar formulario con imagen
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('price', price);
      if (imageFile) formData.append('image', imageFile);
      await fetch(`${URI_API}/products`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => Swal.fire('Guardado', `Producto guardado con id: ${data.id}`, 'success'))
        .catch((err) => console.log(err.message));
    } else {
      // UPDATE
      // Enviar formulario con posible nueva imagen
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('price', price);
      if (imageFile) formData.append('image', imageFile);
      await fetch(`${URI_API}/product/${_id}`, {
        method: "PUT",
        body: formData,
      })
        .then((res) => res.json())
        .then(() => Swal.fire('Editado', `Producto editado con id: ${_id}`, 'success'))
        .catch((err) => console.log(err.message));
    }
    getProducts();
    setEditing(false);
    resetForm();
  }

  // Leer todos los productos
  async function getProducts() {
    await fetch(`${URI_API}/products`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log(err.message));
  }

  // Eliminar un producto
  async function deleteProduct(id) {
    const result = await Swal.fire({
      title: '¿Eliminar?',
      text: `¿Seguro que deseas eliminar el producto ${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`${URI_API}/product/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.num_rows === 1) {
        await getProducts();
        Swal.fire('Eliminado', 'Producto eliminado correctamente', 'success');
      } else {
        Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
      }
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  }

  // Leer un solo producto (para editar)
  async function getProduct(id) {
    await fetch(`${URI_API}/product/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setId(data.id);
        setTitle(data.title);
        setCategory(data.category);
        setDescription(data.description);
        setImageFile(data.image);
        setPrice(data.price);
        setEditing(true);
      })
      .catch((err) => console.log(err.message));
  }

  // Limpiar el formulario
  const resetForm = () => {
    setId("");
    setTitle("");
    setCategory("");
    setDescription("");
    setImageFile(null);
    setPrice("");
  };

  /* ———————————————————————————————— JSX ———————————————————————————————— */
  return (
    <div className="row">
      {/* Formulario */}
      <div className="col-md-4">
        <form onSubmit={handleSubmit} className="card card-body">
          <div className="form-group">
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="form-control"
              placeholder="Title"
              required
            />
          </div>
          <div className="form-group">
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="form-control"
              required
            >
              <option value="">Selecciona categoría</option>
              {categoriesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <input
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="form-control"
              placeholder="Description"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="form-control"
              required={!editing}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="form-control"
              placeholder="Price"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            {editing ? "Edit" : "Save"}
          </button>
        </form>
      </div>

      {/* Tabla */}
      <div className="col-md-4">
        <table className="table table-hover table-striped">
          <thead>
            <tr className="table-primary">
              <th>Id</th>
              <th>Title</th>
              <th>Category</th>
              <th>Description</th>
              <th style={{ maxWidth: "30px" }}>Image</th>
              <th>Price</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.title}</td>
                <td>{product.category}</td>
                <td>{product.description}</td>
                <td>
                  <img src={product.image} height={200} alt={product.title} />
                </td>
                <td>{product.price}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={() => getProduct(product.id)}
                  >
                    Edit
                  </button>{" "}
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
