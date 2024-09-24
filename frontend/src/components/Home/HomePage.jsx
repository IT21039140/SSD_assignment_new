import React from "react";
import { Container, Button, Row, Col, CardGroup,} from "react-bootstrap";
import {Link} from "react-router-dom";
import bgimg from "../../images/hero-background.jpg";
import "./HomePage.css";
import ServiceCards from "./ServiceCards";
import card01img from "../../images/image 01.jpg";
import card02img from "../../images/image 02.jpg";
import card03img from "../../images/image 03.jpg";
import sec3Img from "../../images/mediSpoon.jpg";
import qualityBadge from "../../images/quality.jpg";

export default function HomePage() {
  return (
    <Container fluid>
      <Row>
        <Col
          fluid
          style={{
            background: `rgba(0, 0, 0, 0.7) url(${bgimg})`,
            backgroundPosition: "center center",
            backgroundSize: "cover",
            height: "95vh",
          }}
          className="d-flex align-items-center justify-content-center hero-section"
        >
          <div>
            <div>
              <h5>Embrace the Art of Dressing </h5>
              <h1 className="pt-3">Step into Style, Strut with Confidence</h1>
              <h6 className="pt-3">
              At Our Fashion Destination, We're Dedicated to Helping You Curate a Wardrobe that Reflects Your Unique Personality
              </h6>
            </div>
            <Row className="mt-5">
              <Col>
              <Link to="/shop"><Button className="shopNow-btn">Shop Now</Button></Link>
              <Link to="/login"><Button className="ms-5 signIn-btn">Sign In</Button></Link>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <section
        className="mt-5"
        style={{ textAlign: "center", margin: "0 6rem 0 6rem" ,color:"#99775C"}}
      >
        <h3 className="mb-5">Let's start your purchase</h3>

        <CardGroup>
          <ServiceCards
            key={1}
            image={card01img}
            title="Monochrome Looks"
            description="Monochromatic outfits, featuring a single color from head to toe, are chic and sophisticated. This trend allows for creative styling with different textures and shades of the same color"
          />

          <ServiceCards
            key={1}
            image={card02img}
            title="Bold Prints and Patterns"
            description="Vibrant prints and eye-catching patterns are making a statement in fashion. From florals to animal prints to geometric designs, bold prints add excitement and personality to outfits"
          />

          <ServiceCards
            key={1}
            image={card03img}
            title="Gender-Fluid Fashion"
            description="Fashion that blurs traditional gender boundaries is becoming more prevalent. This includes unisex clothing styles, gender-neutral designs, and diverse representations in marketing campaigns"
          />
        </CardGroup>
      </section>

      <section style={{ margin: "4rem 0 0 0" }}>
        <Row>
          <Col
            style={{
              backgroundImage: `url(${sec3Img})`,
              backgroundPosition: "right center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              height: "95vh",
            }}
          ></Col>
          <Col className="d-flex justify-content-center align-items-center">
            <div style={{ textAlign: "center", width: "70%" }}>
              <h2>Fashion Perks: Discounts + Free Shipping!</h2>
              <p>
                Dress to Impress for Less! Enjoy Exclusive Discounts and Easy Payment Options on Our Website and Experience Fashion Bliss with Irresistible Discounts and Convenient Click-and-Collect Facilities
              </p>
              <Link to="/shop"><Button className="shopNow-btn">Shop Now</Button></Link>
            </div>
          </Col>
        </Row>
      </section>

      <section style={{ margin: "4rem 0 4rem 0" }}>
        <Row>
          <Col className="d-flex justify-content-center align-items-center">
            <div style={{ textAlign: "center", width: "70%" }}>
              <h2>Save Big, Shop Anytime, Anywhere</h2>
              <p>
              Save Big on Trendsetting Fashion, with the Freedom to Shop Anytime, Anywhere, and Elevate Your Style from the Comfort of Your Own Space
              </p>
              <Link to="/about"><Button className="signIn-btn text-black" id="aboutBtn">More About US</Button></Link>
            </div>
          </Col>
          <Col
            style={{
              background: `url(${qualityBadge})`,
              backgroundPosition: "center center",
              backgroundRepeat:"no-repeat",
              backgroundSize: "cover",
              height: "100vh",
            
            }}
          ></Col>
        </Row>
      </section>
    </Container>
  );
}
