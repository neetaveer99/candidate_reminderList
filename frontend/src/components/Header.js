import React, {useState} from 'react'
import logo from "../l1.png";


const Header = () => {

    const [isActive, setIsActive] = useState(false);
    const [isSearchActive, setIsSearchActive] = useState(false);
  
    const handleMenuClick = () => {
        setIsActive(!isActive);
        setIsSearchActive(false);
      };


      const handleSearchClick = () => {
        setIsSearchActive(!isSearchActive);
        setIsActive(false);
      };


  return (
    <div>
         <header className="header">
        <a href="#" className="logo">
          <img src={logo} alt="" />
        </a>

        <nav className={`navbar ${isActive ? 'active' : ''}`}>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#review">Review</a>
          <a href="#contact">Contact</a>
          <a href="#blogs">Blogs</a>
        </nav>

        <div className="icons">
          <div className="fas fa-search" id="search-btn" onClick={handleSearchClick}></div>
          <div className="fas fa-bars" id="menu-btn" onClick={handleMenuClick}></div>
        </div>

        <div className={`search-form ${isSearchActive ? 'active' : ''}`}>
          <input type="search" name="" id="search-box" placeholder="search here..." />
          <label htmlFor="search-box" className="fas fa-search"></label>
        </div>

        </header>
    </div>
  )
}

export default Header