// src/components/Frame6.js
import React from "react";
import Map from "./Map"; // 방금 올린 Map.js

const Frame6 = () => {
  return (
    <div className="screen">
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>📍 청주 식당 지도</h2>
      <Map />
    </div>
  );
};

export default Frame6;
