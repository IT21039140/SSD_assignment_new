// import { useContext, useDebugValue } from "react";
// import AuthContext from "../context/AuthContext";

// const useAuth = () => {
//     const { auth } = useContext(AuthContext);
//     useDebugValue(auth, auth => auth?.user ? "Logged In" : "Logged Out")
//     return useContext(AuthContext);
// }

// export default useAuth;

// import { useContext, useDebugValue } from "react";
// import AuthContext from "../context/AuthContext";

// const useAuth = () => {
//     const authContext = useContext(AuthContext);
//     const auth = authContext.auth ?? { userdata: null }; // Provide a default object structure

//     // Use debug value to show whether the user is logged in or not
//     useDebugValue(auth.userdata ? "Logged In" : "Logged Out");

//     return { auth }; // Always return an object with the auth property
// };

// export default useAuth;

import { useContext,useDebugValue } from "react";
import AuthContext from "../context/AuthContext";

const useAuth = () => {
    const { auth, setAuth } = useContext(AuthContext); // Destructure both auth and setAuth

    // Optional: Use useDebugValue to help debugging with React DevTools
    useDebugValue(auth, auth => auth?.userdata ? "Logged In" : "Logged Out");

    return { auth, setAuth }; // Return both auth and setAuth
};

export default useAuth;
