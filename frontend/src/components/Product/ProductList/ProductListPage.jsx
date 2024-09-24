import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import bimg from "../../../images/productBanner.png";
import "../productlist.css";
import ProductFilter from "./ProductFilter";
import ProductCardContainer from "./ProductCardContainer";

export default function ProductListPage() {
  return (
    <Container fluid>
      <Row>
        <Col
          style={{ backgroundImage: `url('https://marketplace.canva.com/EAFuUVuQu98/1/0/1600w/canva-yellow-pink-bold-fashion-sale-landscape-banner-XgQnSpGbsnQ.jpg')`, height: "95vh" }}
          className="bannerImage"
        ></Col>
    
      </Row>

    
          <ProductFilter />
          <br></br>
          <ProductCardContainer />
     
      
    </Container>
  );
}
