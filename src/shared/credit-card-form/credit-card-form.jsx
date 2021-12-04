import React from "react";
import { PaystackButton } from "react-paystack";
import config from "../../config.json";
import authService from "../../services/authService";
import transactionService from "../../services/transactionService";

const CreditCardForm = ({
  register,
  errors,
  amount,
  buttonText,
  profile,
  onResponse,
}) => {
  if (authService.getCurrentUser() === undefined)
    return (window.location = "/");

  const getCardExpirationMonth = (length) => {
    const months = [...Array(length).keys()].map((x) => ({
      _id: x + 1,
      name: x + 1,
    }));
    months.splice(0, 0, { _id: "", name: "Month" });
    return months;
  };

  const getCardExpirationYear = (start, end) => {
    const difference = end - start;
    const years = [...Array(difference + 1).keys()].map((x) => {
      return {
        _id: start + x,
        name: start + x++,
      };
    });
    years.splice(0, 0, { _id: "", name: "Year" });
    return years;
  };

  const referenceId = new Date().getTime();

  const API_CONFIG = {
    reference: referenceId,
    email: authService.getCurrentUser().email,
    amount: amount ? amount * 100 : 5000,
    publicKey: config.PAYSTACK_PUBLIC_KEY,
  };

  const handleSuccess = () => {
    transactionService
      .verifyTransaction(referenceId)
      .then(({ data }) => onResponse(data));
  };

  const componentProps = {
    ...API_CONFIG,
    className: "btn btn-sm btn-danger font-small",
    text: buttonText,
    onSuccess: handleSuccess,
    onClose: () => null,
  };

  return <PaystackButton {...componentProps} />;
  // return (
  //   <div className="col-12">
  //     {/* <button onClick={() => initializePayment()}>Paystack</button> */}
  //     {/* <PaystackButton {...componentProps} /> */}
  //     <Input
  //       register={register}
  //       errors={errors}
  //       label="Card Number"
  //       name="cardNo"
  //       type="number"
  //       required={true}
  //     />
  //     <div className="row">
  //       <div className="col">
  //         <p className="mb-1 label">
  //           Expiration{" "}
  //           <span style={{ color: "red", fontWeight: "bold" }}>*</span>
  //         </p>
  //         <div className="row">
  //           <div className="col expiration">
  //             <Select
  //               name="expirationMonth"
  //               items={getCardExpirationMonth(12)}
  //               register={register}
  //               errors={errors}
  //             />
  //           </div>
  //           <div className="col expiration month">
  //             <Select
  //               name="expirationYear"
  //               items={getCardExpirationYear(2020, 2056)}
  //               register={register}
  //               errors={errors}
  //             />
  //           </div>
  //         </div>
  //       </div>
  //       <div className="col">
  //         <p className="mb-1 label">
  //           Security Code{" "}
  //           <span style={{ color: "red", fontWeight: "bold" }}>*</span>
  //         </p>
  //         <Input register={register} errors={errors} name="cvc" maxLength="3" />
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default CreditCardForm;
