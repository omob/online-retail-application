import React, { Fragment, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import Button from "../../../common/forms/button";
import Input from "../../../common/forms/input";
import TextArea from "../../../common/forms/textarea";
import Loading from "../../../common/loading/loading";
import productService from "../../../services/productService";
import "./manage-product.scss";
import ProductHeader from "./products-header";

const ManageProduct = ({ history, location, match }) => {
  const [productImageUrl, setImageUrl] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      if (match.params && match.params.id) {
        try {
          setLoading(true);
          const { data: product } = await productService.getProduct(
            match.params.id
          );
          setValue([
            { name: product.name },
            { imageUrl: product.imageUrl },
            { description: product.description },
            { price: product.price },
          ]);
          setImageUrl(product.imageUrl);
          setLoading(false);
        } catch (e) {
          setLoading(false);
          toast.error("Product not found: " + e.message);
          history.push({
            pathname: "/dashboard/products",
          });
        }
      }
    };
    getProduct();
  }, []);

  // validation schema
  const schema = yup.object().shape({
    name: yup.string().required("Product Name is required"),
    price: yup.string().required("Price is required"),
    description: yup.string().required("Product Description is required"),
    imageUrl: yup.string(),
  });

  const { register, handleSubmit, reset, setValue, errors } = useForm({
    validationSchema: schema,
  });

  // setValue({
  //   name: product.name,
  // });

  const onSubmit = async (data) => {
    // call backend api
    setLoading(true);
    try {
      await productService.saveProduct(data, match.params.id);
      reset(); //reset form
      history.replace({
        pathname: "/dashboard/products",
      });
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error(ex.response.data);
      }
      setLoading(false);
    }
  };

  const handleImageUrlonBlur = ({ target }) => {
    setImageUrl(target.value);
  };

  return (
    <Fragment>
      <div className="mb-4">
        <ProductHeader
          location={location.pathname.includes("new") ? "Add New" : "Edit "}
        />
      </div>
      <div className="container" id="manage-product">
        <div className="row">
          <div className="col-12 col-lg-10">
            <Loading isLoading={isLoading} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-lg-8 col-12">
                  <Input
                    register={register}
                    errors={errors}
                    label="Product Name"
                    name="name"
                  />
                  <Input
                    register={register}
                    errors={errors}
                    label="Price"
                    name="price"
                    type="number"
                  />
                  <label>Description</label>
                  <TextArea
                    register={register}
                    errors={errors}
                    label="Description"
                    name="description"
                  />
                  <Input
                    register={register}
                    errors={errors}
                    label="Image Url"
                    name="imageUrl"
                    onBlur={handleImageUrlonBlur}
                  />
                </div>

                {productImageUrl && (
                  <div className="col-lg-4 col-12">
                    <div className="card my-4">
                      <img
                        src={productImageUrl}
                        className="img-thumbnail"
                        alt=""
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="col-lg-8 col-12 my-3 text-right">
                <Button label="Save" className="btn btn-danger btn-sm"></Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="space-5"></div>
    </Fragment>
  );
};

export default ManageProduct;
