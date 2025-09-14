import "./home.component.scss";
import Navbar from '../navbar/navbar.component.jsx';
import logoWithoutBackground from '../assets/logo-without-background.png';
import adoracaoVideo from '../assets/adoracao.mp4';

function Home() {

  return (
    <div className="home">
      <Navbar/>
      <div className="parallax">
        <video className="background-video" autoPlay muted loop>
          <source src={adoracaoVideo} type="video/mp4" />
        </video>
        <img className="logo" src={logoWithoutBackground} alt="Logo" />
      </div>

      <div className="footer">
        <p>Testando</p>

      </div>
        
    </div>
  );
}

export default Home;
