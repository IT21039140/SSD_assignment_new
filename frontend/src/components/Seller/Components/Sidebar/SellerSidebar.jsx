import React, { useEffect, useState } from "react";
import "./Sellersidebar.css";
import $ from "jquery";

import { Link, useLocation } from "react-router-dom";

const SellerSidebar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    // set the active item based on the current URL path
    const path = location.pathname;
    setActiveItem(path);

    // add click event handler to sidebar items
    $(".sidebar ul li").on("click", function () {
      setActiveItem($(this).find("a").attr("href"));
    });
  }, [location]);

  return (
    <div className="main-container">
      <div className="sidebar" id="side-nav">
        <div className="header-box px-3 pt-3 pb-4 d-flex">
         
          <button className="btn d-md-none d-block close-btn px-2 py-0 text-white">
            <i class="bi bi-list"></i>
          </button>
        </div>

        <div className="logoSideBar">
        
        </div>

        <div>
          <ul className="list-untyled px-2">
            <li
              className={
                activeItem === "/seller/dashboard" ? "active" : ""
              }
            >
              <Link
                to="/seller/dashboard"
                className="text-decoration-none px-3 py-2 d-block"
              >
                <i class="bi bi-house-door"></i>
                <span style={{ paddingLeft: "0.7rem" }}>Dashboard</span>
              </Link>
            </li>
            <li
              className={
                activeItem === "/seller/products" ? "active" : ""
              }
            >
              <Link
                to="/seller/products"
                className="text-decoration-none px-3 py-2 d-block"
              >
                <i class="bi bi-bag-plus"></i>
                <span style={{ paddingLeft: "0.7rem" }}>My Products</span>
              </Link>
            </li>
            <li
              className={
                activeItem === "/seller/allorders" ? "active" : ""
              }
            >
              <Link
                to="/seller/allorders"
                className="text-decoration-none px-3 py-2 d-block"
              >
                <i class="bi bi-card-list"></i>
                <span style={{ paddingLeft: "0.7rem" }}></span>
              </Link>
            </li>
            {/* <li>
              <Link to="#" className="text-decoration-none px-3 py-2 d-block">
                <i class="bi bi-people"></i>
                <span style={{ paddingLeft: "0.7rem" }}>Users</span>
              </Link>
            </li> */}
            <li
              className={
                activeItem === "/seller/profile" ? "active" : ""
              }
            >
              <Link
                to="/seller/profile"
                className="text-decoration-none px-3 py-2 d-block"
              >
                <i class="bi bi-bag-plus"></i>
                <span style={{ paddingLeft: "0.7rem" }}></span>
              </Link>
            </li>
          </ul>
        </div>
        <hr className="h-color mx-2" />
      </div>
    </div>
  );
};

export default SellerSidebar;
