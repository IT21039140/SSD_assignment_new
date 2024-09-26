import "./styles.css";
import { useState, useEffect } from "react";
import { axiosPrivate } from "../../../api/axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState(""); // State to hold the CSRF token
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axiosPrivate.get("/api/csrf-token"); // Adjust according to your axios instance
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
      const url = "/api/users/login";
      const { data: res } = await axiosPrivate.post(url, data, {
        headers: {
          "CSRF-Token": csrfToken, // Include the CSRF token in the headers
        },
      });
      
      setAuth({
        userdata: res.data,
        role: res.data.type,
        accessToken: res.accesstoken,
      });

      // Redirect based on user type
      switch (res.data.type) {
        case "admin":
          navigate("/admin", { replace: true });
          break;
        case "buyer":
          navigate("/customer/profile", { replace: true });
          break;
        case "seller":
          navigate("/seller/profile", { replace: true });
          break;
        default:
          navigate("/", { replace: true }); // Navigate to a default route if user type is unknown
          break;
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
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
          <Form className="frmlogin" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <br />
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
            {error && <div className="error">{error}</div>}
            <br />
            <div className="btn-container">
              <Button className="btnsign" variant="primary" type="submit">
                Submit
              </Button>
            </div>
            <div className="frmtext">
              <small>
                Don't have an account?{" "}
                <a href="/signup">
                  Create account
                </a>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
