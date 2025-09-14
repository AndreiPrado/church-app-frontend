import "./home.component.scss";
import Navbar from '../navbar/navbar.component.jsx';
import logoWithoutBackground from '../assets/logo-without-background.png';
import adoracaoVideo from '../assets/adoracao.mp4';

function Home() {

  return (
    <div className="home">
      <Navbar/>
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
        <img className="logo" src={logoWithoutBackground} alt="Logo" />
      </div>

      <div className="footer">
        <h1>Visão que nasce com Zelo.</h1> <br/>
        <p>
          A Zele Church <strong>nasce</strong> do coração de <strong>Deus</strong>, em resposta a um tempo onde o mundo clama por cuidado, verdade e direção. <br/>
          Seu nome vem da palavra "<strong>Zelo</strong>" um chamado ao compromisso, à santidade e à dedicação fervorosa. <strong>Zele</strong> é mais do que um nome: <strong> é uma cultura</strong>.
        </p>
      </div>
        
    </div>
  );
}

export default Home;
