import React, { Fragment, useEffect, useState } from "react";
import queryString from "querystring";
import Loading from "../../common/loading/loading";
import authService from "../../services/authService";
import productService from "../../services/productService";
import Product from "../product/product";
import SubscriptionModal from "../subscribe-modal/subscribe-modal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import transactionService from "../../services/transactionService";
import OrderReceived from "../order-received/order-received";

import "./products.scss";

const Products = ({ history, location, products: productsInDb }) => {
  const [products, setProducts] = useState(productsInDb);
  const [currentUser, setCurentUser] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(productsInDb);

  useEffect(() => {
    if (location.search && products.length !== 0) {
      const { subscribe: id } = queryString.parse(location.search);

      const selectedProduct = products.find((product) => product._id === id);
      setModalData(selectedProduct);
      setModalVisibility(true);
    }

    if (authService.getCurrentUser())
      setCurentUser(authService.getCurrentUser());
  }, [location.search, products, productsInDb]);

  const [isOrderProcessing, setOrderProcessing] = useState(false);
  const [isModalVisible, setModalVisibility] = useState(false);
  const [isOrderModalVisible, setOrderReceivedModalVisibility] =
    useState(false);
  const [modalData, setModalData] = useState(null);

  const handleModalVisibility = () => {
    setModalVisibility(false);
  };

  const handleOrderVisibility = () => {
    setOrderReceivedModalVisibility(false);
  };

  const handleSubscribe = (product) => {
    if (!currentUser)
      history.push({
        pathname: "/register",
        state: { product },
      });

    setModalData(product);
    setModalVisibility(true);
  };

  const handleNotLoggedInForPayNow = () => {
    toast.error("You must either log in or register to pay for a product");
    history.push({ pathname: "/login" });
  };

  const handlePaymentSuccess = async (response, product) => {
    const { status, reference } = response;

    if (status !== "success") {
      toast.error("Error completing payment");
      return;
    }

    setOrderProcessing(true);
    await transactionService.purchasedProduct(reference, product);
    setOrderProcessing(false);
    setOrderReceivedModalVisibility(true);
  };

  const handleFilter = ({ target }) => {
    const query = target.value.toLowerCase();

    if (query.trim() === "") return setFilteredProducts(products);

    const filtered = [...products].filter(({ name }) => {
      return name.toLowerCase().includes(query);
    });

    setFilteredProducts(filtered);
  };

  return (
    <div style={{ position: "relative" }}>
      <Loading isLoading={isOrderProcessing} />
      <div className="row">
        <div className="col-12 mb-2 mt-3">
          <div className="float-right text-right">
            <input
              type="text"
              className="search"
              onKeyUp={handleFilter}
              placeholder="Search for product..."
            />
          </div>
        </div>
      </div>
      <div className="row products-container justify-content">
        {products &&
          filteredProducts.map((product, index) => (
            <div className="col-sm-auto col-xs-12 product" key={index}>
              <Product
                product={product}
                onSubscribe={handleSubscribe}
                onNotLoggedIn={handleNotLoggedInForPayNow}
                onPaymentSuccess={(response) =>
                  handlePaymentSuccess(response, product)
                }
              />
            </div>
          ))}
        {filteredProducts.length == 0 && (
          <p className="text-center pt-4 mx-auto font-normal font-weight-bold p-2">
            Product not available. <br />
            Modify Search Query or Search for Another Product.
          </p>
        )}
        {products.length === 0 && (
          <p className="text-center pt-4 mx-auto">
            No products available at this time, please check back later.
          </p>
        )}
      </div>
      {isModalVisible && (
        <SubscriptionModal
          isVisible={isModalVisible}
          handleVisibility={handleModalVisibility}
          data={modalData}
        />
      )}

      {isOrderModalVisible && (
        <OrderReceived
          title="Order Received"
          handleVisibility={handleOrderVisibility}
          isVisible={isOrderModalVisible}
        />
      )}
    </div>
  );
};

export default Products;
