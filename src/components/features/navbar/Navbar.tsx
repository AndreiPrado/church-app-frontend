"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>
        <Link href="/home">
          <Image 
            src="/assets/logo-black-white.png" 
            alt="Z'ele Church" 
            width={38} 
            height={37} 
            className={styles.logoImage}
          />
        </Link>
      </div>

      {/* Botão hamburguer → vira X */}
      <div className={styles.menu}>
        <button
          className={`${styles.hamburger} ${open ? styles.open : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Menu lateral */}
      <div className={`${styles.sideMenu} ${open ? styles.show : ""}`}>
        <ul>
          <li>
            <Link href="/sing-up" onClick={() => setOpen(false)}>
              Quero ser membro
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
