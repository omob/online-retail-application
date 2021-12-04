import React, { Fragment } from "react";
import "../landing-page/landing-page.scss";
import "./about.scss";

const AboutPage = ({ history, location }) => {
  return (
    <Fragment>
      <div className="container">
        <div className="row ">
          <div className="col-12 col-sm-6 mt-2 px-5 align-items-center">
            <div className="pt-5">
              <h2 className="sdm-title">ABOUT US</h2>
              <hr></hr>
              <p>
                Sanabliss Global Resources is an innovative retail general
                provider in Nigeria. We render groceries, car rentage, textiles,
                furniture services and other general services through our
                various channels including internet and mobile app platforms.
                Our outstanding products and services are created to suit the
                general requirements of our diverse clients. We commenced
                business in 2011 and have since delivered retail general service
                in an unprecedented manner to our esteemed customers.
              </p>
              <p>
                We continuously strive to understand our clients' need so we can
                provide delivery solutions and opportunities. We strongly
                believe in integrity, empathy, respect, innovation and creating
                value in everything we do. Our vision is to remain the leading
                technologically innovative retail general provider in Africa.
                Our services are delivered in a targeted way that puts into
                consideration our corporate relationships and client's
                preferences because we place great importance in sustaining
                lasting relationships with our clients throughout their lives.
              </p>
              <p>
                We have a team of like-minded people, mutually driven,
                supportive of each other, friendly, creative and positively
                motivated towards working together productively to create value
                whether first to ourselves then to our client-base, investors
                and community at large with the single goal of being exceptional
                by all standards in our relationships.
              </p>
            </div>
          </div>
          <div className="col col-sm-6 aboutbg"></div>
        </div>
        <div className="space-5"></div>
        <div className="space-5"></div>
      </div>
    </Fragment>
  );
};

export default AboutPage;
