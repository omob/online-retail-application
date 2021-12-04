import React, { Fragment } from "react";

import "./footer.scss";

const Footer = () => {
  return (
    <Fragment>
      <footer>
        <div className="container">
          <div className="row">
            <div className="col text-right">Copyright 2021</div>
            <div className="col text-left">
              Developed by
              <a
                href="http://ayodejiabodunrin.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                Ayodeji Abodunrin
              </a>
            </div>
          </div>
        </div>
      </footer>
    </Fragment>
  );
};

export default Footer;
