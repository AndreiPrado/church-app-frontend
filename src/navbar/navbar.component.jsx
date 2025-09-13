import { useState } from "react";
import "./navbar.component.scss";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">Z'ele Church</div>

      {/* Botão hamburguer → vira X */}
      <div>
        <button
          className={`hamburger ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Menu lateral */}
      <div className={`side-menu ${open ? "show" : ""}`}>
        <ul>
          <li><a href="#sing-up" onClick={() => setOpen(false)}>Quero ser membro</a></li>
        </ul>
      </div>
    </nav>
  );
}
