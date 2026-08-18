"use client";

import React from 'react';

export default function Header() {
  return (
    <>
      <header className="topbar">
        <a href="#" className="brand" aria-label="Home">
          <img src="assets/LOGO.png" alt="XTARK" />
        </a>
        <nav className="links" aria-label="Primary">
          <a href="#">Services</a>
          <a href="#">Portfolio</a>
          <a href="#">FAQ</a>
          <a href="#">Contact</a>
        </nav>
        <a href="#" className="pill pill-nav"><span>Start Project</span></a>
        <button className="burger" id="burger" aria-label="Open menu" aria-expanded="false">
          <i></i>
          <i></i>
        </button>
      </header>

      <nav className="menu" id="menu" aria-hidden="true">
        <div className="menu-inner">
          <p className="menu-eyebrow">Menu</p>
          <ul className="menu-list">
            <li><a href="#">Services</a></li>
            <li><a href="#">Portfolio</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
          <div className="menu-foot">
            <a href="#" className="pill"><span>Start Project</span></a>
            <a href="#" className="ghost">Our Services</a>
          </div>
        </div>
      </nav>
    </>
  );
}
