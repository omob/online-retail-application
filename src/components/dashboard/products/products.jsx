import React, { Fragment, useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { Link } from "react-router-dom";
import ProductHeader from "./products-header";
import ConfirmDelete from "../../../common/confirmDelete/confirm-delete";
import Loading from "../../../common/loading/loading";

import productService from "../../../services/productService";
import "./products.scss";
import { toast } from "react-toastify";
import { formatNumberWithComma } from "../../../common/functions";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const { data: products } = await productService.getProducts();
      setProducts(products);
      setLoading(false);
    };
    getProducts();
  }, []);

  const confirmDelete = (productId) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <ConfirmDelete
            onClose={onClose}
            handleDelete={() => handleProductDelete(productId)}
          />
        );
      },
    });
  };

  const handleProductDelete = async (productId) => {
    console.log(productId);
    const _products = [...products];
    const filteredProducts = _products.filter((p) => p._id !== productId);

    try {
      setProducts(filteredProducts);
      await productService.removeProduct(productId);

      toast.info("Success Deleting item");
    } catch (e) {
      // revert back
      toast.error("Error deleting: " + e.message);
      return setProducts(_products);
    }
  };
  return (
    <Fragment>
      <div id="products" className="space-5">
        <ProductHeader />
        <Loading isLoading={isLoading} />
        <div className="container mt-3">
          <div className="row">
            <div className="col">
              {products.length > 0 && (
                <table className="table table-hover custom-table-responsive table-border-none col-12 col-lg-10 ">
                  <thead>
                    <tr>
                      <th>Sn.</th>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(({ _id, name, imageUrl, price }, index) => (
                      <tr key={_id}>
                        <td>{index + 1}</td>
                        <td>
                          <img src={imageUrl} alt={name} />
                        </td>
                        <td>{name}</td>
                        <td>&#x20a6;{formatNumberWithComma(price)}</td>
                        <td>
                          <div className="button-group">
                            <Link
                              to={"/dashboard/products/edit/" + _id}
                              className="btn btn-sm font-small"
                            >
                              Edit
                            </Link>
                            <button
                              className="btn btn-danger btn-sm font-small"
                              onClick={() => confirmDelete(_id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {products.length === 0 && (
                <p>
                  No products available at this time. Please check back later.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Products;
