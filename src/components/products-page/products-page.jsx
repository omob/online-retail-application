import React, { useEffect, useState } from "react";
import authService from "../../services/authService";
import productService from "../../services/productService";
import Products from "../products/products";
import Loading from "../../common/loading/loading";
import styles from "./products-page.module.scss";

const ProductsPage = (props) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);

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
  }, []);

  return (
    <div className={styles.productsPage + " container"}>
      <div className="row">
        <div className="col col-sm-12">
          <h3 className="pt-4 my-2 mx-2 font-weight-bold">PRODUCTS</h3>
          <hr className="mt-0 pt-0 hr"></hr>
          <Loading isLoading={isLoading} />
          {products.length !== 0 && <Products products={products} {...props} />}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
