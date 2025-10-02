import { useEffect, useState } from "react";
import "./navbar.component.scss";
import logo from "../../assets/logo-blue.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`navbar${open ? ' open' : ''}${isScrolled ? ' scrolled' : ''}`}>
      {/* Logo */}
      <div className="logo">
        <a href="/home"><img src={logo} alt="Z'ele Church" /></a>
      </div>

      {/* Botão hamburguer → vira X */}
      <div className="menu">
        <button
          className={`hamburger ${open ? 'open' : ''}`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Menu lateral */}
      <div className={`side-menu ${open ? 'show' : ''}`}>
        <ul>
          <li><a href="/signup" onClick={() => setOpen(false)}>Quero ser membro</a></li>
        </ul>
      </div>
    </nav>
  );
}
