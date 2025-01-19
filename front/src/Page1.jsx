import React, { useEffect } from "react";
import runAnimations from "./scripts";
import backgroundImage1 from "./images/image1.png";
import { Link } from "react-router-dom";

import "./styles.css";

const Page1 = () => {
  useEffect(() => {
    runAnimations();
  }, []);

  const openNetflixLink = () => {
    window.open(
      "https://www.netflix.com/tudum/articles/how-to-watch-kaleidoscope-explainer",
      "_blank"
    );
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage1})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "150px",
          left: "80px",
          color: "#FFFFFF",
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontWeight: "bold",
            fontSize: "130px",
            marginBottom: "10px",
            textAlign: "center",
            marginTop: "80px",
          }}
        >
          Kaleidoscope
        </h1>
        <p style={{ fontSize: "20px", textAlign: "center", marginTop: "20px" }}>
          Welcome to Kaleidoscope: Where Colors Shape Your Story!
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "170px",
          display: "flex",
          gap: "10px",
          zIndex: 1,
        }}
      >
        <button className="btn" onClick={openNetflixLink}>
          <svg
            height="24"
            width="24"
            fill="#FFFFFF"
            viewBox="0 0 24 24"
            className="sparkle"
          >
            <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
          </svg>
          <span className="text">netflix</span>
        </button>

        <Link to="/board">
          <button className="btn">
            <svg
              height="24"
              width="24"
              fill="#FFFFFF"
              viewBox="0 0 24 24"
              className="sparkle"
            >
              <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
            </svg>
            <span className="text">Select order</span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Page1;
