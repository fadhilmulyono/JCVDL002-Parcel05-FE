import React from "react";
import Axios from 'axios';
import { API_URL } from '../constants/API';
import "../assets/styles/admin.css"
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';

class Admin extends React.Component {
  state = {
    productList: [],

    addProductName: "",
    addPrice: 0,
    addProductImage: "",
    addDescription: "",
    addCategory: "",

    editId: 0,

    editProductName: "",
    editPrice: 0,
    editProductImage: "",
    editDescription: "",
    editCategory: "",
  }

  fetchProducts = () => {
    Axios.get(`${API_URL}/products`)
    .then((result) => {
      this.setState({ productList: result.data })
    })
    .catch(() => {
      alert("Terjadi kesalahan di server")
    })
  }

  editToggle = (editData) => {
    this.setState({ 
      editId: editData.id,
      editProductName: editData.productName,
      editPrice: editData.price,
      editProductImage: editData.productImage,
      editDescription: editData.description,
      editCategory: editData.category, 
    })
  }

  cancelEdit = () => {
    this.setState({ editId: 0 })
  }

  saveBtnHandler = () => {
    Axios.patch(`${API_URL}/products/${this.state.editId}`, {
      productName: this.state.editProductName,
      price: parseInt(this.state.editPrice),
      productImage: this.state.editProductImage,
      description: this.state.editDescription,
      category: this.state.editCategory,
    })
    .then(() => {
      this.fetchProducts()
      this.cancelEdit();
    })
    .catch(() => {
      alert("Terjadi kesalahan")
    })
  }

  deleteBtnHandler = (deleteId) => {
    const confirmDelete = window.confirm("Yakin delete barang?");
    if (confirmDelete) {
      Axios.delete(`${API_URL}/products/${deleteId}`)
      .then(() => {
        this.fetchProducts();
      })
      .catch(() => {
        alert("Terjadi kesalahan di server!")
      })
    } else {
      alert("Cancel delete barang");
    }
  }

  renderProducts = () => {
    return this.state.productList.map(val => {
      if (val.id === this.state.editId) {
        return (
          <tr>
            <td>{val.id}</td>
            <td><input placeholder="Nama Produk" value={this.state.editProductName} onChange={this.inputHandler} type="text" className="form-control" name="editProductName"/></td>
            <td><input placeholder="Harga Produk" value={this.state.editPrice} onChange={this.inputHandler} type="number" className="form-control" name="editPrice"/></td>
            <td><input placeholder="Foto Produk" value={this.state.editProductImage} onChange={this.inputHandler} type="text" className="form-control" name="editProductImage"/></td>
            <td><input placeholder="Deskripsi Produk" value={this.state.editDescription} onChange={this.inputHandler} type="text" className="form-control" name="editDescription"/></td>
            <td>
              <select value={this.state.editCategory} onChange={this.inputHandler} name="editCategory" className="form-control">
                <option value="">Kategori</option>
                <option value="bahanpokok">Bahan pokok</option>
                <option value="ikan">Ikan</option>
                <option value="seafood">Seafood</option>
                <option value="buah">Buah-buahan</option>
                <option value="sayur">Sayuran</option>
              </select>
            </td>
            <td>
              <button onClick={this.saveBtnHandler} className="btn btn-success">Save</button>
            </td>
            <td>
              <button onClick={this.cancelEdit} className="btn btn-danger">Cancel</button>
            </td>
          </tr>
        )
      }
      return (
        <tr>
          <td>{val.id}</td>
          <td>{val.productName}</td>
          <td>{val.price}</td>
          <td><img className="admin-product-image" src={val.productImage} alt=""/></td>
          <td>{val.description}</td>
          <td>{val.category}</td>
          <td>
            <button onClick={() => this.editToggle(val)} className="btn btn-warning">Edit</button>
          </td>
          <td>
            <button onClick={() => this.deleteBtnHandler(val.id)} className="btn btn-danger">Delete</button>
          </td>
        </tr>
      )
    })
  }

  addNewProduct = () => {
    Axios.post(`${API_URL}/products`, {
      productName: this.state.addProductName,
      price: parseInt(this.state.addPrice),
      productImage: this.state.addProductImage,
      description: this.state.addDescription,
      category: this.state.addCategory,
    })
    .then(() => {
      this.fetchProducts()
      this.setState({
        addProductName: "",
        addPrice: 0,
        addProductImage: "",
        addDescription: "",
        addCategory: "", 
      })
    })
    .catch(() => {
      alert("Terjadi kesalahan di server")
    })
  }

  inputHandler = (event) => {
    const { name, value } = event.target

    this.setState({ [name]: value })
  }

  componentDidMount() {
    this.fetchProducts()
  }

  render() {
    if (this.props.userGlobal.role !== "admin") {
      return <Redirect to="/" />
    }
    
    return (
      <div className="p-5">
        <div className="row">
          <div className="col-12 text-center">
            <h1>Manage Products</h1>
              <div class="table-responsive">
              <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Image</th>
                          <th>Description</th>
                          <th>Category</th>
                          <th colSpan="2">Action</th>
                        </tr>
                      </thead>
                      <tfoot>
                          <tr>
                          <th></th>
                          <th>
                              <input placeholder="Nama Produk" value={this.state.addProductName} onChange={this.inputHandler} name="addProductName" type="text" className="form-control" />
                          </th>
                          <th>
                              <input placeholder="Harga Produk" value={this.state.addPrice} onChange={this.inputHandler} name="addPrice" type="number" className="form-control" />
                          </th>
                          <th>
                              <input placeholder="Gambar Produk" value={this.state.addProductImage} onChange={this.inputHandler} name="addProductImage" type="text" className="form-control" />
                          </th>
                          <th>
                              <input placeholder="Deskripsi Produk" value={this.state.addDescription} onChange={this.inputHandler} name="addDescription" type="text" className="form-control" />
                          </th>
                          <th>
                              <select onChange={this.inputHandler} name="addCategory" className="form-control">
                              <option value="">Kategori</option>
                              <option value="bahanpokok">Bahan pokok</option>
                              <option value="ikan">Ikan</option>
                              <option value="seafood">Seafood</option>
                              <option value="buah">Buah-buahan</option>
                              <option value="sayur">Sayuran</option>
                              </select>
                          </th>
                          <th colSpan="2">
                              <button onClick={this.addNewProduct} className="btn btn-info">Add Product</button>
                          </th>
                          </tr>
                      </tfoot>
                      <tbody>
                        {this.renderProducts()}
                      </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userGlobal: state.user
  }
}

export default connect(mapStateToProps)(Admin);