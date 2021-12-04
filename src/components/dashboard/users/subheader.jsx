import React from "react";
import { Link } from "react-router-dom";

const SubHeader = ({ links }) => {
  return (
    <div className="nav navbar pl-4 ">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {links.map(({ name, url, className = "", icon }, index) => (
              <Link
                key={index}
                to={url}
                className={
                  "btn font-small font-weight-bold  btn-sm " + className
                }
              >
                {icon && <i className={"fa " + icon} />} {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;
