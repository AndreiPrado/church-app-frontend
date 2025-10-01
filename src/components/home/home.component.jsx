import "./home.component.scss";
import Navbar from '../navbar/navbar.component.jsx';
import logoWithoutBackground from '../../assets/logo-without-background.png';
import adoracaoVideo from '../../assets/intro.mp4';
import { Parallax } from 'react-scroll-parallax';
import { useEffect, useMemo, useRef, useState } from "react";

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
      <div className="parallax">
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
        <Parallax translateY={[-40, 40]} className="logo-container">
          <img className="logo" src={logoWithoutBackground} alt="Logo" />
        </Parallax>
      </div>

      <Parallax translateY={[0, -120]} className="footer-container">
        <div className="footer" ref={footerRef}>
          <h1>Visão que nasce com Zelo.</h1> <br />
          <p className="typing-text">
            {renderTypedFooterText()}
            {showCaret && <span className="typing-caret" />}
          </p>
        </div>
      </Parallax>

      <div className="more-info">
        <h1>Quero saber mais...</h1>

        <p>Em breve traremos mais informações.</p>
      </div>
    </div>
  );
}

export default Home;
