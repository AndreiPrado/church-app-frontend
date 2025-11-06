import "./home.component.scss";
import Navbar from '../navbar/navbar.component.jsx';
import NavigationDropdown from '../navigation-dropdown/navigation-dropdown.component.jsx';
import logoWithoutBackground from '../../assets/logo-without-background.png';
import encontro1 from '../../assets/encontro_1.jpeg';
import encontro2 from '../../assets/encontro_2.jpeg';
import encontro3 from '../../assets/encontro_3.jpeg';
import encontro4 from '../../assets/encontro_4.jpeg';
import historia1 from '../../assets/historia_1.jpeg';
import historia2 from '../../assets/historia_2.jpeg';
import historia3 from '../../assets/historia_3.jpeg';
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

const TYPING_WORDS = ['Zelar', 'Servir', 'Pertencer', 'Amar', 'Cuidar', 'Ficar'];

function Home() {
  const footerRef = useRef(null);
  const videoRef = useRef(null);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [typedCharacters, setTypedCharacters] = useState(0);

  // Estados para o efeito de digitação do subtítulo
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Estado para dropdown de navegação
  const [isNavigationDropdownOpen, setIsNavigationDropdownOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');

  // Estado para flip cards
  const [flippedCards, setFlippedCards] = useState([false, false, false, false]);
  const valueCardsRef = useRef([]);

  // Estado para ministérios selecionados
  const [selectedMinistry, setSelectedMinistry] = useState(null);

  // Detectar se é mobile para otimizações
  const isMobile = useMemo(() => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
  }, []);

  // Dados dos ministérios
  const ministries = [
    {
      icon: HandsPrayingIcon,
      iconColor: '#9c27b0', // Roxo - música/louvor/espiritual
      title: 'Zele Music',
      description: 'Louvor com propósito, presença e santidade.',
      mysteryMessage: 'Novidades sobre ensaios, cultos e escalas em breve.'
    },
    {
      icon: GenderMaleIcon,
      iconColor: '#1976d2', // Azul escuro - força/liderança
      title: 'Zele Men',
      description: 'Homens que zelam por sua fé, casa e chamado.',
      mysteryMessage: 'Prepare-se para encontros que fortalecem e edificam.'
    },
    {
      icon: GenderFemaleIcon,
      iconColor: '#e91e63', // Rosa/Pink - feminino/empoderamento
      title: 'PreciosaZ',
      description: 'Mulheres intensas, curadas e cheias de propósito.',
      mysteryMessage: 'Um movimento poderoso está por vir. Fique ligada!'
    },
    {
      icon: HeartIcon,
      iconColor: '#ff9800', // Laranja - alegria/infância
      title: 'ZKids',
      description: 'Pequenos corações, grandes destinos.',
      mysteryMessage: 'Diversão, aprendizado e presença. Aguarde novidades!'
    },
    {
      icon: UsersThreeIcon,
      iconColor: '#00bcd4', // Ciano - transição/adolescência
      title: 'Next Teen',
      description: 'A próxima geração já está aqui.',
      mysteryMessage: 'Amizade, identidade e poder. Fique de olho!'
    },
    {
      icon: UsersFourIcon,
      iconColor: '#ff5722', // Laranja escuro - energia jovem
      title: 'Next Level',
      description: 'Fogo jovem, raízes firmes.',
      mysteryMessage: 'Conexão real, propósito eterno. Vem aí!'
    },
    {
      icon: HouseIcon,
      iconColor: '#4caf50', // Verde - família/crescimento
      title: 'Zele Family',
      description: 'Casas que honram a presença.',
      mysteryMessage: 'Eventos e recursos para famílias em construção.'
    },
    {
      icon: HandHeartIcon,
      iconColor: '#f44336', // Vermelho - amor/serviço
      title: 'Zele Serve',
      description: 'Servir é a linguagem do céu.',
      mysteryMessage: 'Descubra onde suas mãos podem transformar vidas.'
    },
    {
      icon: PlantIcon,
      iconColor: '#8bc34a', // Verde claro - natureza/sustentabilidade
      title: 'Zele Impact',
      description: 'Zelo pela terra e pelo próximo.',
      mysteryMessage: 'Projetos que cuidam da criação e transformam vidas.'
    }
  ];

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

    // Mobile: 30ms (mais lento, menos CPU)
    // Desktop: 15ms (mais rápido)
    const typingInterval = isMobile ? 30 : 15;

    const interval = setInterval(() => {
      setTypedCharacters((prev) => Math.min(prev + 1, totalCharacters));
    }, typingInterval);

    return () => clearInterval(interval);
  }, [hasStartedTyping, typedCharacters, totalCharacters, isMobile]);

  // Efeito para cursor piscante
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Fix para Safari: forçar play do vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Tentar reproduzir após um pequeno delay
      const playVideo = () => {
        video.play().catch(err => {
          console.log('Autoplay prevented:', err);
          // Se falhar, tentar novamente após interação do usuário
          const playOnInteraction = () => {
            video.play();
            document.removeEventListener('touchstart', playOnInteraction);
            document.removeEventListener('click', playOnInteraction);
          };
          document.addEventListener('touchstart', playOnInteraction);
          document.addEventListener('click', playOnInteraction);
        });
      };

      // Delay pequeno para garantir que o vídeo está carregado
      setTimeout(playVideo, 100);
    }
  }, []);

  // Flip cards no scroll
  useEffect(() => {
    // No mobile, usar threshold mais simples para melhor performance
    const threshold = isMobile ? [0, 0.5, 1] : [0, 0.3, 0.7, 1];

    const observers = valueCardsRef.current.map((card, index) => {
      if (!card) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
            setFlippedCards(prev => {
              if (prev[index] === true) return prev;
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.3) {
            setFlippedCards(prev => {
              if (prev[index] === false) return prev;
              const newState = [...prev];
              newState[index] = false;
              return newState;
            });
          }
        },
        { threshold }
      );

      observer.observe(card);
      return observer;
    });

    return () => {
      observers.forEach(observer => observer?.disconnect());
    };
  }, [isMobile]);

  // Efeito para digitação e apagamento
  useEffect(() => {
    const currentWord = TYPING_WORDS[currentWordIndex];

    // Mobile: velocidades mais lentas (menos CPU)
    // Desktop: velocidades normais
    const typingSpeed = isMobile
      ? (isDeleting ? 80 : 150)  // Mobile: mais lento
      : (isDeleting ? 50 : 100);  // Desktop: normal

    const pauseBeforeDelete = 2000;
    const pauseBeforeType = 500;

    const timer = setTimeout(() => {
      if (!isDeleting && currentText === currentWord) {
        // Pausar antes de começar a apagar
        setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
      } else if (isDeleting && currentText === '') {
        // Mudar para próxima palavra (aleatória)
        setIsDeleting(false);
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * TYPING_WORDS.length);
        } while (nextIndex === currentWordIndex && TYPING_WORDS.length > 1);
        setCurrentWordIndex(nextIndex);
      } else if (isDeleting) {
        // Apagando
        setCurrentText(currentWord.substring(0, currentText.length - 1));
      } else {
        // Digitando
        setCurrentText(currentWord.substring(0, currentText.length + 1));
      }
    }, isDeleting && currentText === '' ? pauseBeforeType : typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, isMobile]);

  // Scroll suave para seção quando vier de outra página com hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Delay para garantir que a página carregou completamente
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  // Otimizado com useMemo para evitar recálculos desnecessários
  const renderedFooterText = useMemo(() => {
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
  }, [typedCharacters]);

  const handleAddressClick = (address) => {
    setSelectedAddress(address);
    setIsNavigationDropdownOpen(true);
  };

  const showCaret = hasStartedTyping && typedCharacters < totalCharacters;

  return (
    <div className="home">
      <Navbar />

      <NavigationDropdown
        isOpen={isNavigationDropdownOpen}
        onClose={() => setIsNavigationDropdownOpen(false)}
        address={selectedAddress}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <video
          ref={videoRef}
          className="background-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          controls={false}
          poster="https://pub-22cbb41d434e4362b0fbd47e35c1874b.r2.dev/video/frame.jpg"
        >
          <source src="https://pub-22cbb41d434e4362b0fbd47e35c1874b.r2.dev/video/video-h265.mp4" type="video/mp4; codecs=hevc" />
          <source src="https://pub-22cbb41d434e4362b0fbd47e35c1874b.r2.dev/video/video-h264.mp4" type="video/mp4; codecs=avc1" />
        </video>

        <div className="hero-overlay" />
        <div className="hero-content">
          <Parallax translateY={[-10, 10]} opacity={[0.9, 1]}>
            <div className="logo-container">
              <img className="hero-logo" src={logoWithoutBackground} alt="Zele Church Logo" />
            </div>
          </Parallax>
          <Parallax translateY={[0, 10]}>
            <h1 className="hero-title">Bem-vindo à <span className="highlight">Zele Church</span></h1>
            <p className="hero-subtitle">
              Uma igreja para <span className="typing-word">{currentText}</span>
              <span className="typing-cursor" style={{ opacity: showCursor ? 1 : 0 }}>|</span>
            </p>
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
          <Parallax translateY={[-15, 15]}>
            <h2 className="section-title">Visão que nasce com <span className="highlight">Zelo</span></h2>
            <div className="typing-text">
              {renderedFooterText}
              {showCaret && <span className="typing-caret" />}
            </div>
          </Parallax>
        </div>
      </section>

      {/* Valores Section */}
      <section className="values-section" id="valores">
        <div className="container">
          <h2 className="section-title">Nossos <span className="highlight">Valores</span></h2>
          <div className="values-grid">
            <Parallax opacity={[0.6, 1]}>
              <div className="value-card-flip" ref={el => valueCardsRef.current[0] = el}>
                <div className={`value-card-inner ${flippedCards[0] ? 'flipped' : ''}`}>
                  <div className="value-card-front">
                    <HeartIcon size={48} weight="fill" className="value-icon" />
                    <h3>Amor</h3>
                  </div>
                  <div className="value-card-back">
                    <h3>Amor</h3>
                    <p>Demonstramos o amor de Cristo em cada ação e palavra, refletindo Seu cuidado incondicional</p>
                  </div>
                </div>
              </div>
            </Parallax>
            <Parallax opacity={[0.6, 1]}>
              <div className="value-card-flip" ref={el => valueCardsRef.current[1] = el}>
                <div className={`value-card-inner ${flippedCards[1] ? 'flipped' : ''}`}>
                  <div className="value-card-front">
                    <HandHeartIcon size={48} weight="fill" className="value-icon" />
                    <h3>Zelo</h3>
                  </div>
                  <div className="value-card-back">
                    <h3>Zelo</h3>
                    <p>Comprometidos a zelar por cada pessoa com dedicação e paixão santa pelo Reino de Deus</p>
                  </div>
                </div>
              </div>
            </Parallax>
            <Parallax opacity={[0.6, 1]}>
              <div className="value-card-flip" ref={el => valueCardsRef.current[2] = el}>
                <div className={`value-card-inner ${flippedCards[2] ? 'flipped' : ''}`}>
                  <div className="value-card-front">
                    <MapPinIcon size={48} weight="fill" className="value-icon" />
                    <h3>Propósito</h3>
                  </div>
                  <div className="value-card-back">
                    <h3>Propósito</h3>
                    <p>Guiados pela palavra e direção de Deus, vivendo com intenção e significado eterno</p>
                  </div>
                </div>
              </div>
            </Parallax>
            <Parallax opacity={[0.6, 1]}>
              <div className="value-card-flip" ref={el => valueCardsRef.current[3] = el}>
                <div className={`value-card-inner ${flippedCards[3] ? 'flipped' : ''}`}>
                  <div className="value-card-front">
                    <UsersIcon size={48} weight="fill" className="value-icon" />
                    <h3>Comunidade</h3>
                  </div>
                  <div className="value-card-back">
                    <h3>Comunidade</h3>
                    <p>Somos uma família unida pela fé, onde cada pessoa é valorizada e tem seu lugar</p>
                  </div>
                </div>
              </div>
            </Parallax>
          </div>
        </div>
      </section>

      {/* Photos Parallax Section */}
      <section className="photos-parallax-section">
        <div className="parallax-content">
          <div className="parallax-images">
            <Parallax translateY={[-30, 30]} className="parallax-img parallax-img-1">
              <img src={encontro1} alt="Noite do Encontro na Zele" />
            </Parallax>
            <Parallax translateY={[40, -40]} className="parallax-img parallax-img-2">
              <img src={encontro2} alt="Noite do Encontro na Zele" />
            </Parallax>
            <Parallax translateY={[-20, 20]} className="parallax-img parallax-img-3">
              <img src={encontro3} alt="Noite do Encontro na Zele" />
            </Parallax>
            <Parallax translateY={[25, -25]} className="parallax-img parallax-img-4">
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
      <section className="services-section" id="cultos">
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
                <button
                  onClick={() => handleAddressClick('Avenida Jacu Pêssego, 7639, São Paulo')}
                  className="service-address"
                >
                  <MapPinIcon size={18} weight="fill" />
                  <span>Av. Jacu Pêssego, 7639</span>
                </button>
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
                <button
                  onClick={() => handleAddressClick('Avenida Jacu Pêssego, 7639, São Paulo')}
                  className="service-address"
                >
                  <MapPinIcon size={18} weight="fill" />
                  <span>Av. Jacu Pêssego, 7639</span>
                </button>
              </div>
            </Parallax>
          </div>
        </div>
      </section>

      {/* História Section */}
      <section className="history-section" id="historia">
        {/* Background Images */}
        <div className="history-bg-img history-bg-img-1">
          <img src={historia1} alt="" />
        </div>
        <div className="history-bg-img history-bg-img-2">
          <img src={historia2} alt="" />
        </div>
        <div className="history-bg-img history-bg-img-3">
          <img src={historia3} alt="" />
        </div>

        <div className="container">
          <div className="history-content">
            <Parallax opacity={[0.6, 1]}>
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
            <div className="history-stats">
              <Parallax translateX={[-40, 40]} opacity={[0.6, 1]}>
                <div className="stat-card">
                  <HandsPrayingIcon size={40} weight="fill" />
                  <h3>150+</h3>
                  <p>Membros</p>
                </div>
              </Parallax>
              <Parallax translateX={[40, -40]} opacity={[0.3, 1]}>
                <div className="stat-card">
                  <BookOpenIcon size={40} weight="fill" />
                  <h3>4</h3>
                  <p>Meses de caminhada</p>
                </div>
              </Parallax>
              <Parallax translateX={[-40, 40]} opacity={[0.3, 1]}>
                <div className="stat-card">
                  <HeartHalfIcon size={40} weight="fill" />
                  <h3>∞</h3>
                  <p>Vidas impactadas</p>
                </div>
              </Parallax>
            </div>
          </div>
        </div>
      </section>

      {/* Ministérios Section */}
      <section className="ministries-section" id="ministerios">
        <div className="container">
          <h2 className="section-title">Nossos <span className="highlight">Ministérios</span></h2>
          <div className="ministries-grid">
            {ministries.map((ministry, index) => {
              const IconComponent = ministry.icon;
              const isSelected = selectedMinistry === index;

              return (
                <div
                  key={index}
                  className={`ministry-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedMinistry(isSelected ? null : index)}
                >
                  <IconComponent
                    size={48}
                    weight="duotone"
                    className="ministry-icon"
                    style={{ color: ministry.iconColor }}
                  />
                  <h3>{ministry.title}</h3>
                  <div className="ministry-content">
                    <p className={`ministry-description ${isSelected ? 'fade-out' : 'fade-in'}`}>
                      {ministry.description}
                    </p>
                    <p className={`ministry-mystery ${isSelected ? 'fade-in' : 'fade-out'}`}>
                      {ministry.mysteryMessage}
                    </p>
                  </div>
                </div>
              );
            })}
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
