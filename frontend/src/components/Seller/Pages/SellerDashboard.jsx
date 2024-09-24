import React, { useEffect, useState } from "react";
import "./styles/SellerDashboard.css";
import { Container, Row, Col } from "react-bootstrap";
import SellerSidebar from "../Components/Sidebar/SellerSidebar";
import SellerNav from "../Components/SystemNavBar/SellerNav";

const SellerDashboard = () => {


  return (
    <div className="mainContainer">
      <div className="sidebar">
        <SellerSidebar />
      </div>

      <div
        className="contentContainer"
        
          style={{ backgroundImage: `url('https://marketplace.canva.com/EAFuUVuQu98/1/0/1600w/canva-yellow-pink-bold-fashion-sale-landscape-banner-XgQnSpGbsnQ.jpg')`, height: "100vh" ,width:"180vh"}}
          
        
          



      
      >
        <div className="systemNavBar">
         
        </div>
        <div className="content">
       
          <br />
         
        </div>

      </div>
    </div>
  );
};

export default SellerDashboard;
