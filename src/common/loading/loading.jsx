import React from "react";
import "./loading.css";
const Loading = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="loading-bg">
        <div className="loading"></div>
      </div>
    )
  );
};

export default Loading;
