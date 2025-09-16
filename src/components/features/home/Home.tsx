"use client";

import { Parallax } from "react-scroll-parallax";
import Image from "next/image";
import styles from "./Home.module.scss";
import Navbar from "@/components/features/navbar/Navbar";

export default function Home() {
  return (
    <div className={styles.home}>
      <Navbar />
      <div className={styles.parallax}>
        <video
          className={styles.backgroundVideo}
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          controls={false}
        >
          <source src="/assets/adoracao.mp4" type="video/mp4" />
        </video>
        <Parallax translateY={[-40, 40]} opacity={[0.9, 1]}>
          <div className={styles.logoContainer}>
            <Image 
              src="/assets/logo-without-background.png" 
              alt="Logo" 
              width={250} 
              height={250} 
              className={styles.logo}
              priority
            />
          </div>
        </Parallax>
      </div>

      <Parallax translateY={[0, -120]} className={styles.footerContainer}>
        <div className={styles.footer}>
          <h1>Visão que nasce com Zelo.</h1>
          <br />
          <p>
            A Zele Church <strong>nasce</strong> do coração de{" "}
            <strong>Deus</strong>, em resposta a um tempo onde o mundo clama por
            cuidado, verdade e direção. <br />
            Seu nome vem da palavra &ldquo;<strong>Zelo</strong>&rdquo; um chamado ao
            compromisso, à santidade e à dedicação fervorosa.{" "}
            <strong>Zele</strong> é mais do que um nome: <strong> é uma cultura</strong>.
          </p>
        </div>
      </Parallax>

      <div className={styles.moreInfo}>
        <h1>Quero saber mais...</h1>
        <p>Em breve traremos mais informações.</p>
      </div>
    </div>
  );
}
