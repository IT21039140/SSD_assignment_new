import "./styles.css";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container, Row, Col } from "react-bootstrap";
import axios from "../../../api/axios"; // Ensure this points to your configured axios instance

const Signup = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    type: "",
  });

  const [csrfToken, setCsrfToken] = useState(""); // State to hold the CSRF token
  const [error, setError] = useState("");

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get("/api/csrf-token", {
          withCredentials: true, // Important: include credentials in requests
        });
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "/api/users/signup"; // Ensure this endpoint matches your backend route
      const { data: res } = await axios.post(
        url,
        data,
        {
          headers: {
            "CSRF-Token": csrfToken, // Include the CSRF token in the headers
          },
          withCredentials: true, // Important: include credentials in requests
        }
      );
      window.location.href = "http://localhost:3000/login"; // Redirect after successful signup
      console.log(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col className="from-container">
          <Form className="frmsign" onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <br />
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                onChange={handleChange}
                value={data.name}
                required
                className="lablesign"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className="lablesign"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className="lablesign"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicDropdown">
              <Form.Label>Customer type</Form.Label>
              <Form.Select
                className="lablesign"
                aria-label="Default select example"
                name="type"
                onChange={handleChange}
                value={data.type}
                required
              >
                <option value="">Select customer type</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </Form.Select>
            </Form.Group>
            {error && <div className="error">{error}</div>}
            <br />
            <div className="btn-container">
              <Button className="btnsign" variant="primary" type="submit">
                Submit
              </Button>
            </div>
            <div className="frmtext">
              <small>
                Already have an account? <a href="/login">Login</a>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
