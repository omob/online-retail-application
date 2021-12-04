import queryString from "querystring";
import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../common/loading/loading";
import authService from "../../services/authService";
import productService from "../../services/productService";
import Products from "../products/products";
import "./landing-page.scss";

const LandingPage = (props) => {
  // if (authService.getCurrentUser()) return <Redirect to="/dashboard" />;
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const [currentUser, setCurentUser] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data: products } = await productService.getProducts();
        setProducts(products);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };
    getProducts();

    if (authService.getCurrentUser())
      setCurentUser(authService.getCurrentUser());
  }, []);

  return (
    <Fragment>
      <div className="container-fluid">
        {/* <Loading isLoading={isOrderProcessing} /> */}
        <div className="row ">
          <div className="col-12 col-sm-auto mt-2 px-5 align-items-center">
            <div className="intro extra">
              <h2 className="sdm-title">SANABLISS GLOBAL RESOURCES</h2>
              <hr></hr>
              <p>
                Sanabliss Global Resources is an innovative retail general
                provider in Nigeria. We render groceries, car rentage, textiles,
                furniture services and other general services through our
                various channels including internet and mobile app platforms.
                Our outstanding products and services are created to suit the
                general requirements of our diverse clients.
              </p>
              <Link to="/about" className="btn btn-danger btn-sm">
                Learn More
              </Link>
            </div>
          </div>
          <div className="col col-sm-12 products-section">
            <h3 className="pt-4 my-3 font-weight-bold">Available Products</h3>
            <hr className="mt-0 pt-0"></hr>
            <Loading isLoading={isLoading} />
            {products.length !== 0 && (
              <Products products={products} {...props} />
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LandingPage;
