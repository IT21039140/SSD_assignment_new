import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});
const cartDataLocal = JSON.parse(localStorage.getItem("auth"));

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(cartDataLocal);
  // Add this useEffect hook to check if the user is redirected back after Google login
  useEffect(() => {
    const checkGoogleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const userData = params.get("user"); // assuming your backend sends user data back as a query parameter
      const accessToken = params.get("accessToken"); // similarly for the access token

      if (userData && accessToken) {
        const parsedUserData = JSON.parse(userData); // Parse the user data if it's sent as JSON string

        setAuth({
          userdata: parsedUserData,
          role: parsedUserData.type,
          accessToken: accessToken,
        });
      }
    };

    checkGoogleAuth();
  }, [setAuth]);
  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
