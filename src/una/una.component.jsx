// import './App.css'
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./una.component.scss";
import InputMask from 'react-input-mask';

function Una() {
  let emailRef = useRef();
  let passwordRef = useRef();

  let navigateTo = useNavigate();

  function login() {
    console.log(emailRef.current.value);
    console.log(passwordRef.current.value);

    navigateTo("/welcome");
  }
  return (
    <div className="container">
      <header className="header">
        {/* <img src={logo} className='logo' alt="logo" /> */}
        <span>FAÇA SEU CADASTRO NO UNA</span>
      </header>
      <form>
        <div className="inputContainer">
          <label htmlFor="cpf">CPF</label>
          <InputMask
          mask="999.999.999-99"
          maskChar=""
          type="text"
          name="cpf"
          id="cpf"
          placeholder="000.000.000-00"
         />
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="**********"
          />
        </div>

        <Link to="/home" className="resetPassword">Esqueceu sua senha?</Link>
        <button className="button" onClick={login}>
          Entrar
        </button>
        <div className="footer">
          <p>Primeira vez por aqui?</p>
          <Link to="/home"> Crie sua conta</Link>
        </div>
      </form>
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

export default Una;
