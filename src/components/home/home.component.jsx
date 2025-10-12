import "./home.component.scss";
import Navbar from '../navbar/navbar.component.jsx';
import logoWithoutBackground from '../../assets/logo-without-background.png';
import adoracaoVideo from '../../assets/intro.mp4';
import encontro1 from '../../assets/encontro_1.jpeg';
import encontro2 from '../../assets/encontro_2.jpeg';
import encontro3 from '../../assets/encontro_3.jpeg';
import encontro4 from '../../assets/encontro_4.jpeg';
import { Parallax } from 'react-scroll-parallax';
import { useEffect, useMemo, useRef, useState } from "react";
import { HandHeartIcon, HeartIcon, UsersIcon, MapPinIcon, CalendarIcon, ClockIcon, CrossIcon, HandsPrayingIcon, BookOpenIcon, HeartHalfIcon, UsersFourIcon, ArrowRightIcon, InstagramLogoIcon, FacebookLogoIcon, UsersThreeIcon, HouseIcon, GenderFemaleIcon, GenderMaleIcon, PlantIcon } from "@phosphor-icons/react";

const FOOTER_TEXT_SEGMENTS = [
  { text: 'A Zele Church ' },
  { text: 'nasce', bold: true },
  { text: ' do coração de ' },
  { text: 'Deus', bold: true },
  { text: ', em resposta a um tempo onde o mundo clama por cuidado, verdade e direção.' },
  { break: true },
  { text: 'Seu nome vem da palavra "' },
  { text: 'Zelo', bold: true },
  { text: '" um chamado ao compromisso, à santidade e à dedicação fervorosa. ' },
  { text: 'Zele', bold: true },
  { text: ' é mais do que um nome: ' },
  { text: 'é uma cultura', bold: true },
  { text: '.', bold: false }
];

function Home() {
  const footerRef = useRef(null);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [typedCharacters, setTypedCharacters] = useState(0);

  const totalCharacters = useMemo(
    () => FOOTER_TEXT_SEGMENTS.reduce((acc, segment) => acc + (segment.break ? 1 : segment.text.length), 0),
    []
  );

  useEffect(() => {
    const element = footerRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStartedTyping(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStartedTyping) return undefined;
    if (typedCharacters >= totalCharacters) return undefined;

    const interval = setInterval(() => {
      setTypedCharacters((prev) => Math.min(prev + 1, totalCharacters));
    }, 35);

    return () => clearInterval(interval);
  }, [hasStartedTyping, typedCharacters, totalCharacters]);

  const renderTypedFooterText = () => {
    let remaining = typedCharacters;
    const elements = [];

    FOOTER_TEXT_SEGMENTS.forEach((segment, index) => {
      if (segment.break) {
        if (remaining > 0) {
          elements.push(<br key={`br-${index}`} />);
          remaining = Math.max(remaining - 1, 0);
        }
        return;
      }

      if (remaining <= 0) {
        return;
      }

      const visibleCount = Math.min(segment.text.length, remaining);
      const content = segment.text.slice(0, visibleCount);
      remaining -= visibleCount;

      if (content.length === 0) {
        return;
      }

      if (segment.bold) {
        elements.push(
          <strong key={`segment-${index}`}>
            {content}
          </strong>
        );
      } else {
        elements.push(
          <span key={`segment-${index}`}>
            {content}
          </span>
        );
      }
    });

    return elements;
  };

  const showCaret = hasStartedTyping && typedCharacters < totalCharacters;

  return (
    <div className="home">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <video
          className="background-video"
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          controls={false}
        >
          <source src={adoracaoVideo} type="video/mp4" />
        </video>
        <div className="hero-overlay" />
        <div className="hero-content">
          <Parallax translateY={[-20, 20]} opacity={[0.8, 1]}>
            <div className="logo-container">
              <img className="hero-logo" src={logoWithoutBackground} alt="Zele Church Logo" />
            </div>
          </Parallax>
          <Parallax translateY={[0, 15]}>
            <h1 className="hero-title">Bem-vindo à <span className="highlight">Zele Church</span></h1>
            <p className="hero-subtitle">Uma igreja de fé, amor e Zelo</p>
          </Parallax>
        </div>
        <div className="scroll-indicator">
          <span>Role para descobrir</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Sobre Section */}
      <section className="about-section" id="sobre" ref={footerRef}>
        <div className="container">
          <Parallax translateY={[-30, 30]}>
            <h2 className="section-title">Visão que nasce com <span className="highlight">Zelo</span></h2>
            <div className="typing-text">
              {renderTypedFooterText()}
              {showCaret && <span className="typing-caret" />}
            </div>
          </Parallax>
        </div>
      </section>

      {/* Valores Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Nossos <span className="highlight">Valores</span></h2>
          <div className="values-grid">
            <Parallax rotate={[-5, 5]} opacity={[0.6, 1]}>
              <div className="value-card">
                <HeartIcon size={48} weight="fill" className="value-icon" />
                <h3>Amor</h3>
                <p>Demonstramos o amor de Cristo</p>
              </div>
            </Parallax>
            <Parallax rotate={[5, -5]} opacity={[0.6, 1]}>
              <div className="value-card">
                <HandHeartIcon size={48} weight="fill" className="value-icon" />
                <h3>Zelo</h3>
                <p>Comprometidos a zelar por todos</p>
              </div>
            </Parallax>
            <Parallax rotate={[-5, 5]} opacity={[0.6, 1]}>
              <div className="value-card">
                <MapPinIcon size={48} weight="fill" className="value-icon" />
                <h3>Propósito</h3>
                <p>Guiados pela palavra e direção de Deus</p>
              </div>
            </Parallax>
            <Parallax rotate={[5, -5]} opacity={[0.6, 1]}>
              <div className="value-card">
                <UsersIcon size={48} weight="fill" className="value-icon" />
                <h3>Comunidade</h3>
                <p>Somos uma família unida pela fé</p>
              </div>
            </Parallax>
          </div>
        </div>
      </section>

      {/* Photos Parallax Section */}
      <section className="photos-parallax-section">
        <div className="parallax-content">
          <div className="parallax-images">
            <Parallax translateY={[-60, 60]} className="parallax-img parallax-img-1">
              <img src={encontro1} alt="Noite do Encontro na Zele" />
            </Parallax>
            <Parallax translateY={[80, -80]} className="parallax-img parallax-img-2">
              <img src={encontro2} alt="Noite do Encontro na Zele" />
            </Parallax>
            <Parallax translateY={[-40, 40]} className="parallax-img parallax-img-3">
              <img src={encontro3} alt="Noite do Encontro na Zele" />
            </Parallax>
            <Parallax translateY={[50, -50]} className="parallax-img parallax-img-4">
              <img src={encontro4} alt="Noite do Encontro na Zele" />
            </Parallax>
          </div>
          <div className="parallax-text-overlay">
            <h2>Você não chegou aqui por acaso...</h2>
            <h2><span className="highlight">Deus está conduzindo seus passos.</span></h2>
          </div>
        </div>
      </section>

      {/* Cultos Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Nossos <span className="highlight">Cultos</span></h2>
          <div className="services-grid">
            <Parallax scale={[0.8, 1]} opacity={[0.5, 1]}>
              <div className="service-card">
                <CalendarIcon size={48} weight="duotone" />
                <h3>Domingo</h3>
                <div className="service-time">
                  <ClockIcon size={20} />
                  <span>10h</span>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Avenida+Jacu+Pêssego,+7639,+São+Paulo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="service-address"
                >
                  <MapPinIcon size={18} weight="fill" />
                  <span>Av. Jacu Pêssego, 7639</span>
                </a>
              </div>
            </Parallax>
            <Parallax scale={[0.8, 1]} opacity={[0.5, 1]}>
              <div className="service-card">
                <CalendarIcon size={48} weight="duotone" />
                <h3>Quinta-feira</h3>
                <div className="service-time">
                  <ClockIcon size={20} />
                  <span>20h</span>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Rua+Mexiris,+201,+São+Paulo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="service-address"
                >
                  <MapPinIcon size={18} weight="fill" />
                  <span>Rua Mexiris, 201</span>
                </a>
              </div>
            </Parallax>
          </div>
        </div>
      </section>

      {/* História Section */}
      <section className="history-section">
        <div className="container">
          <div className="history-content">
            <Parallax translateX={[-30, 30]} opacity={[0.5, 1]}>
              <div className="history-text">
                <CrossIcon size={64} weight="duotone" className="history-icon" />
                <h2 className="section-title">Vivendo o <span className="highlight">Novo de Deus</span></h2>
                <p>
                  Estamos vivendo um tempo onde o ordinário dá lugar ao sobrenatural, 
                  e o coração queima por aquilo que vem do alto.
                </p>
                <p className="scripture">
                  <em>&quot;O zelo da Tua casa me consome.&quot;</em> (Salmo 69:9)
                </p>
                <p>
                  Não estamos apenas frequentando um lugar. <strong>Estamos sendo tomados por uma paixão santa!</strong>
                </p>
                <p>
                  Somos daqueles que ardem por Jesus. Não por posição, não por aplausos, 
                  mas por um coração <strong>zeloso</strong> por Ele.
                </p>
                <p>
                  Porque quem ama de verdade, serve com intensidade.
                </p>
                <p className="scripture">
                  <em>&quot;Ele nos purificou para sermos um povo seu, especial, zeloso de boas obras.&quot;</em> (Tito 2:14)
                </p>
              </div>
            </Parallax>
            <Parallax translateX={[30, -30]} opacity={[0.5, 1]}>
              <div className="history-stats">
                <div className="stat-card">
                  <HandsPrayingIcon size={40} weight="fill" />
                  <h3>150+</h3>
                  <p>Membros</p>
                </div>
                <div className="stat-card">
                  <BookOpenIcon size={40} weight="fill" />
                  <h3>4</h3>
                  <p>Meses de caminhada</p>
                </div>
                <div className="stat-card">
                  <HeartHalfIcon size={40} weight="fill" />
                  <h3>∞</h3>
                  <p>Vidas impactadas</p>
                </div>
              </div>
            </Parallax>
          </div>
        </div>
      </section>

      {/* Ministérios Section */}
      <section className="ministries-section">
        <div className="container">
          <h2 className="section-title">Nossos <span className="highlight">Ministérios</span></h2>
          <div className="ministries-grid">
            <Parallax scale={[0.8, 1]} opacity={[0.5, 1]}>
              <div className="ministry-card">
                <HeartIcon size={48} weight="duotone" />
                <h3>Crianças</h3>
                <p>Ensinando os pequenos sobre o amor de Jesus de forma lúdica</p>
              </div>
            </Parallax>
            <Parallax scale={[0.8, 1]} opacity={[0.5, 1]}>
              <div className="ministry-card">
                <UsersThreeIcon size={48} weight="duotone" />
                <h3>Adolescentes</h3>
                <p>Formando identidade em Cristo na fase mais importante da vida</p>
              </div>
            </Parallax>
            <Parallax scale={[0.8, 1]} opacity={[0.5, 1]}>
              <div className="ministry-card">
                <UsersFourIcon size={48} weight="duotone" />
                <h3>Jovens</h3>
                <p>Um espaço para os jovens se conectarem e crescerem na fé</p>
              </div>
            </Parallax>
            <Parallax scale={[0.8, 1]} opacity={[0.5, 1]}>
              <div className="ministry-card">
                <HouseIcon size={48} weight="duotone" />
                <h3>Famílias</h3>
                <p>Fortalecendo os laços familiares através da fé</p>
              </div>
            </Parallax>
            <Parallax scale={[0.8, 1]} opacity={[0.5, 1]}>
              <div className="ministry-card">
                <HandsPrayingIcon size={48} weight="duotone" />
                <h3>Louvor</h3>
                <p>Adoração que nos conecta com a presença de Deus</p>
              </div>
            </Parallax>
            <Parallax scale={[0.8, 1]} opacity={[0.5, 1]}>
              <div className="ministry-card">
                <HandHeartIcon size={48} weight="duotone" />
                <h3>Voluntários</h3>
                <p>Servindo com amor e dedicação ao próximo</p>
              </div>
            </Parallax>
            <Parallax scale={[0.8, 1]} opacity={[0.5, 1]}>
              <div className="ministry-card">
                <GenderFemaleIcon size={48} weight="duotone" />
                <h3>Mulheres</h3>
                <p>Empoderamento feminino através da palavra de Deus</p>
              </div>
            </Parallax>
            <Parallax scale={[0.8, 1]} opacity={[0.5, 1]}>
              <div className="ministry-card">
                <GenderMaleIcon size={48} weight="duotone" />
                <h3>Homens</h3>
                <p>Construindo homens de fé e caráter íntegro</p>
              </div>
            </Parallax>
            <Parallax scale={[0.8, 1]} opacity={[0.5, 1]}>
              <div className="ministry-card">
                <PlantIcon size={48} weight="duotone" />
                <h3>Socioambiental</h3>
                <p>Cuidando da criação de Deus e do meio ambiente</p>
              </div>
            </Parallax>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Faça parte da nossa <span className="highlight">família</span></h2>
          <p>Junte-se a nós e faça parte desta jornada de fé</p>
          <a href="/signup" className="btn btn-primary btn-large">
            Cadastre-se agora <ArrowRightIcon size={24} weight="bold" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src={logoWithoutBackground} alt="Zele Church" />
              <p>Sinta-se em casa. Essa família também é sua!</p>
            </div>
            <div className="footer-links">
              <h4>Links</h4>
              <a href="/signup">Seja membro</a>
              <a href="#sobre">Sobre nós</a>
              <a href="#valores">Valores</a>
            </div>
            <div className="footer-contact">
              <h4>Redes Sociais</h4>
              <div className="social-links">
                <a href="https://www.instagram.com/zelechurch" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <InstagramLogoIcon size={28} weight="fill" />
                </a>
                <a href="https://www.facebook.com/zelechurch" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FacebookLogoIcon size={28} weight="fill" />
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 Zele Church. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
