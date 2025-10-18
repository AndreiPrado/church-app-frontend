import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./navbar.component.scss";
import logo from "../../assets/logo-blue.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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

  // Navegação suave apenas em desktop (não conflita com parallax)
  const handleNavClick = (e, hash) => {
    // Se estamos na mesma página e é desktop
    if (location.pathname === '/home' && window.innerWidth > 768) {
      e.preventDefault();
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    // Mobile e outras páginas: navegação nativa (mais rápida)
  };

  return (
    <nav className={`navbar${open ? ' open' : ''}${isScrolled ? ' scrolled' : ''}`}>
      {/* Logo */}
      <div className="logo">
        <a href="/home"><img src={logo} alt="Z'ele Church" /></a>
      </div>

      {/* Links desktop - visível apenas em desktop */}
      <div className="nav-links">
        <a href="/home#sobre" onClick={(e) => handleNavClick(e, '#sobre')}>Sobre</a>
        <a href="/home#valores" onClick={(e) => handleNavClick(e, '#valores')}>Valores</a>
        <a href="/home#cultos" onClick={(e) => handleNavClick(e, '#cultos')}>Cultos</a>
        <a href="/home#historia" onClick={(e) => handleNavClick(e, '#historia')}>História</a>
        <a href="/home#ministerios" onClick={(e) => handleNavClick(e, '#ministerios')}>Ministérios</a>
        <a href="/signup" className="cta-button">Quero ser membro</a>
      </div>

      {/* Botão hamburguer → vira X (apenas mobile) */}
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

      {/* Menu lateral (apenas mobile) */}
      <div className={`side-menu ${open ? 'show' : ''}`}>
        <ul>
          <li><a href="/home#sobre" onClick={() => setOpen(false)}>Sobre</a></li>
          <li><a href="/home#valores" onClick={() => setOpen(false)}>Valores</a></li>
          <li><a href="/home#cultos" onClick={() => setOpen(false)}>Cultos</a></li>
          <li><a href="/home#historia" onClick={() => setOpen(false)}>História</a></li>
          <li><a href="/home#ministerios" onClick={() => setOpen(false)}>Ministérios</a></li>
          <li className="cta-link"><a href="/signup" onClick={() => setOpen(false)}>Quero ser membro</a></li>
        </ul>
      </div>
    </nav>
  );
}
