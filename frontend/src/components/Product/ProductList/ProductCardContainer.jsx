import React, { useContext, useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import axios from "axios";
import ProductCard from "./ProductCard";
import "./ProductCard.css";
import { Cartcontext } from "../../../context/Context";

export default function ProductCardContainer() {
  const [post, setPost] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5004/api/products/")
      .then((response) => {
        return response.data;
      })
      .then((data) => {
        setPost(data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  }, []);

  const Globalstate = useContext(Cartcontext);
  const dispatch = Globalstate.dispatch;
  // console.log(Globalstate);

  const renderCards = post.map((post) => (
    <ProductCard
      key={post._id}
      id={post._id}
      image={post.image}
      title={post.tital}
      description={post.description}
      price={post.price}
      handleDispatch={dispatch}
    />
  ));

  return (
    <Container>
      <Row md={4} className="g-5">
        {renderCards}
      </Row>
      <Row>
        <div className="col-12">
          <div className="pagination-wrap">
            <nav
              className="navigation paging-navigation text-center padding-medium"
              role="navigation"
            >
              <div className="pagination loop-pagination d-flex justify-content-center">
                <a
                  href="#"
                  className="pagination-arrow d-flex align-items-center"
                >
                  <i className="icon icon-arrow-left"></i>
                </a>
                <span aria-current="page" className="page-numbers current">
                  1
                </span>
                <a className="page-numbers" href="#">
                  2
                </a>
                <a className="page-numbers" href="#">
                  3
                </a>
                <a
                  href="#"
                  className="pagination-arrow d-flex align-items-center"
                >
                  <i className="icon icon-arrow-right"></i>
                </a>
              </div>
            </nav>
          </div>
          <br></br>
        </div>
      </Row>
    </Container>
  );
}
