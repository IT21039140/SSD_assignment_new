import React, { useEffect, useState } from "react";

import SellerSidebar from "../Components/Sidebar/SellerSidebar";
import SellerNav from "../Components/SystemNavBar/SellerNav";
import "./styles/SellerProducts.css";
import AddProductModal from "../../../components/Seller/Components/SellerProducts/AddProductModal";
import UpdateProductModal from "../../../components/Seller/Components/SellerProducts/UpdateProductModal";
import axios from "axios";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import DOMPurify from "dompurify";

const SellerProducts = () => {
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showUpdateProductModal, setShowUpdateProductModal] = useState(false);

  const handleAddProductModalClose = () => setShowAddProductModal(false);
  const handleAddProductModalShow = () => setShowAddProductModal(true);

  const handleUpdateProductModalClose = () => setShowUpdateProductModal(false);
  const handleUpdateProductModalShow = () => setShowUpdateProductModal(true);

  const [product, setProduct] = useState([]);
  const isValidImageUrl = (url) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/.*\\.(?:png|jpg|jpeg|gif|webp))$"
    );
    return pattern.test(url);
  };

  function deleteProduct(id) {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        //if true do the following
        axios
          .delete("http://localhost:5004/api/products/" + id)
          .then((res) => {
            swal("Your product has been deleted!", {
              icon: "success",
            });
            window.location.reload(false);
          })
          .catch((err) => {
            alert(err.message);
          });
      } else {
        swal("Delete cancelled success!");
      }
    });
  }

  const getProducts = () => {
    /*const sellerInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log(sellerInfo);
    const getSellerId = sellerInfo["_id"];*/
    axios
      .get(`http://localhost:5004/api/products/`)

      .then((res) => {
        //const filteredProducts = res.data.filter((products) => {
        // return products.sellerId === getSellerId;
        setProduct(res.data);
      })

      //})
      .catch((err) => {
        alert(err.message);
      });
  };
  useEffect(() => getProducts(), []);

  return (
    <div className="mainContainer">
      <div className="sidebar">
        <SellerSidebar />
      </div>

      <div
        className="contentContainer"
        style={{
          backgroundColor: "#f5f5f5",
          backgroundRepeat: "no-repeat", // Prevent image repetition
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="content">
          <button
            className="btn btnProduct"
            onClick={handleAddProductModalShow}
            value="Add Product"
            style={{ backgroundColor: "#99775C" }}
          >
            Add Product
          </button>

          <AddProductModal
            show={showAddProductModal}
            handleClose={handleAddProductModalClose}
          />
          <UpdateProductModal
            show={showUpdateProductModal}
            handleClose={handleUpdateProductModalClose}
          />

          <div className="container bg-white">
            <div className="row">
              {product.map((product) => (
                <div
                  className="col-lg-3 col-sm-6 d-flex flex-column align-items-center justify-content-center product-i my-3"
                  key={product._id}
                >
                  <div className="product">
                    <img
                      src={
                        isValidImageUrl(product.image)
                          ? DOMPurify.sanitize(product.image)
                          : "default-image-url.jpg"
                      }
                      alt={product.name}
                    />
                    <ul className="d-flex align-items-center justify-content-center list-unstyled icons">
                      <Link to={"/seller/UpdateProductModal/" + product._id}>
                        <li className="icon" id="edit">
                          <span className="bi bi-pen"></span>
                        </li>
                      </Link>
                      <li
                        className="icon mx-3"
                        onClick={() =>deleteProduct(product._id)}
                      >
                        <span className="bi bi-trash"></span>
                      </li>
                    </ul>
                  </div>
                  <div className="tag bg-red">{product.category}</div>
                  <span className="tag1 bg-green">{product.quantity}</span>
                  <div className="title pt-4 pb-1">{product.name}</div>
                  <div className="price">Rs. {product.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProducts;
