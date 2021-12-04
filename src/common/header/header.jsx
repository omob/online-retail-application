import React from "react";
import "./header.scss";

const Header = ({ title }) => {
  return (
    <div id="header" className="p-4">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="text-uppercase title">{title}</h2>
            <hr></hr>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
