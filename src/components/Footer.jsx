import React from 'react';

const YEAR = new Date().getFullYear();

const LINKS = [
  { title: "About Us", href: "#" },
  { title: "License", href: "#" },
  { title: "Contribute", href: "#" },
  { title: "Contact Us", href: "#" },
];

function Footer() {
  return (
    <footer className="w-full bg-green-900 text-white py-6"style={{
         marginRight:"1000px", marginTop:"60px",
      }}>
     
        <div className="text-center md:text-left md:flex md:items-center">
          <p className="text-xs md:text-sm font-light"style={{ width: "200px", height: "50px",marginLeft:"80px"}}>
            &copy; {YEAR} | ARCSPECT
          </p>
        </div>
        
    </footer>
  );
}

export default Footer;
