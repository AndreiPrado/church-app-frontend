// import './App.css'
import { useNavigate } from "react-router-dom";
import "./home.component.scss";
import Navbar from '../navbar/navbar.component.jsx';

function Login() {


  let navigateTo = useNavigate();

  function area(route) {
    navigateTo(route);
  }
  return (
    <div className="container">
      <Navbar/>
      <div className="parallax"></div>

      <div className="footer">
        <p>Testando</p>

      </div>
        {/* 
      <header className="header">
        <img src={logo} className='logo' alt="logo" />
      <h1 className="welcome">Bem-vindo(a) a Igreja da Palavra! </h1>
      </header>
      <div className="body">
        <button className="una" onClick={()=>area('/una')}>
          Área UNA
        </button>
        <button className="member" onClick={() => area('/welcome')}>
          Quero me tornar membro
        </button>
        <button className="login" onClick={() => area('/login')}>
          Login
        </button>
      </div> */}
    </div>

    // <div>
    //   <h1>Login</h1>
    //   <p>E-mail</p>
    //   <input placeholder="teste@teste.com" ref={emailRef}></input>
    //   <p>Senha</p>
    //   <input type="password" ref={passwordRef}></input>
    //   <button onClick={login}>Entrar</button>
    //   <Link to='/home'>Primeira vez? Clique aqui!</Link>
    // </div>
  );
}

export default Login;
