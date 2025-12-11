import "./believer-success.component.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, InstagramLogo, Globe, UserPlus } from "@phosphor-icons/react";

export default function BelieverSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const believerData = location.state?.believerData;

    if (!believerData) {
        navigate('/');
        return null;
    }

    const formatPhone = (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    const instagramLink = "https://www.instagram.com/zelechurch";
    const websiteLink = "https://zelechurch.com.br";

    return (
        <div className="believer-success-page">
            <div className="believer-success-container">

                <div className="success-content">
                    <div className="success-icon">
                        <CheckCircle size={80} weight="fill" />
                    </div>

                    <h1>Cadastro Realizado com Sucesso!</h1>
                    <p className="success-message">
                        Seja muito bem-vindo(a) à nossa comunidade! 🎉
                    </p>

                    <div className="believer-info">
                        <h2>Seus Dados</h2>
                        <div className="info-item">
                            <span className="label">Nome:</span>
                            <span className="value">{believerData.fullName}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Telefone:</span>
                            <span className="value">{formatPhone(believerData.phone)}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">Batizado:</span>
                            <span className="value">{believerData.baptized ? 'Sim' : 'Não'}</span>
                        </div>
                    </div>

                    <div className="next-steps">
                        <h2>Próximos Passos</h2>
                        <div className="steps-list">
                            <div className="step-item">
                                <span className="step-number">1</span>
                                <div className="step-content">
                                    <h3>Entre em contato conosco</h3>
                                    <p>Nossa equipe entrará em contato em breve para acompanhá-lo nessa jornada.</p>
                                </div>
                            </div>
                            <div className="step-item">
                                <span className="step-number">2</span>
                                <div className="step-content">
                                    <h3>Participe dos cultos</h3>
                                    <p>Venha conhecer nossa comunidade e crescer na fé junto conosco.</p>
                                </div>
                            </div>
                            <div className="step-item">
                                <span className="step-number">3</span>
                                <div className="step-content">
                                    <h3>Conecte-se</h3>
                                    <p>Participe de grupos de estudo bíblico e outras atividades da igreja.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <a
                            href={instagramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-instagram"
                        >
                            <InstagramLogo size={24} weight="fill" />
                            Seguir no Instagram
                        </a>
                        <a
                            href={websiteLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-website"
                        >
                            <Globe size={24} weight="fill" />
                            Ir para o Site
                        </a>
                        <button
                            onClick={() => navigate('/new-believer')}
                            className="btn-new-register"
                        >
                            <UserPlus size={24} weight="fill" />
                            Fazer Novo Cadastro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
