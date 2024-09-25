import React, { useContext } from "react";
import { Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Cartcontext } from "../../context/Context";
import axios from "axios";
import useAuth from "../../hooks/useAuth";
// import axios from "axios"

export default function CartPrice() {
  const Globalstate = useContext(Cartcontext);
  const state = Globalstate.state;
  const cart = state;
  const { auth } = useAuth();

  console.log(state);

  const total = state.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    axios
      .post("http://localhost:5002/api/stripe/create-checkout-session", {
        cart,
      })
      .then((res) => {
        const redirectUrl = res.data.url;
        // Validate the URL before using it in window.location
        if (redirectUrl && isValidRedirectUrl(redirectUrl)) {
          window.location.href = redirectUrl;
        } else {
          console.error("Invalid or untrusted redirect URL.");
        }
      })
      .catch((error) => console.error("Error during checkout:", error));
  };
  
  // Function to validate if the URL is trusted
  const isValidRedirectUrl = (url) => {
    try {
      // Define trusted domains or patterns
      const trustedDomains = ["your-trusted-domain.com", "localhost"]; // Update this list with your trusted domains
      const parsedUrl = new URL(url);
      // Check if the parsed URL's domain is in the trusted list
      return trustedDomains.includes(parsedUrl.hostname);
    } catch (error) {
      // If the URL parsing fails, consider it unsafe
      return false;
    }
  };

  return (
    <Col className="cart-price-sec ms-3 p-4" sm={3}>
      <h4>Order Summery</h4>
      <hr />
      <br />
      <h4>Total Amount : $ {total}</h4>
      <h6>Shipping and taxes calculated at checkout</h6>
      <hr />
      {auth.userdata ? (
        <Button className="goto-checkout-btn" onClick={handleCheckout}>
          Go to Checkout
        </Button>
      ) : (
        <Button>
          <Link
            to="/login"
            style={{ textDecoration: "none", color: "white", width: "100%" }}
          >
            Login to process
          </Link>
        </Button>
      )}
    </Col>
  );
}
