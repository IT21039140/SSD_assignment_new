import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import "./ProductCard.css";

export default function ProductCard(props) {
  const { id, image, title, description, price, handleDispatch } = props;
  const path = `/shop/${id}`;

  const item = {
    id: props.id,
    image: props.image,
    title: props.tital,
    desc: props.description,
    quantity: 1,
    price: props.price,
  };

  return (
    <Row>
      <Col className="product-item">
        <div className="image-holder">
          <img src={props.image} alt={props.title} className="product-image" />
        </div>
        <div className="product-detail">
          <h3>{props.title}</h3>
          <p>{props.description}</p>
          <div className="item-price">Rs. {props.price}</div>
        </div>

        <div className="cart-button">
          <button
            type="button"
            className="btn-wrap cart-link d-flex align-items-center"
            onClick={() => handleDispatch({ type: "ADD", payload: item })}
          >
            Add to cart <i className="icon icon-arrow-io"></i>
          </button>
        </div>
      </Col>
    </Row>
  );
}
