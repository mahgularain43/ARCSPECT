import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar'; // Adjust the import path according to your structure

const NavbarWrapper = () => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase(); // Normalize path to lowercase

  // Define routes where the navbar should not be displayed
  const noNavbarRoutes = ["/login", "/signup", "/get-started"];

  // Check if the navbar should be hidden on restricted paths
  const showNavbar = !noNavbarRoutes.some(route => currentPath.startsWith(route));

  return showNavbar ? <Navbar /> : null;
};

export default NavbarWrapper;
