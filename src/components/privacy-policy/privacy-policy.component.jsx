import "./privacy-policy.component.scss";
import Navbar from '../navbar/navbar.component.jsx';
import { ShieldCheckIcon, LockKeyIcon, EyeIcon, BellIcon, UserCircleIcon } from "@phosphor-icons/react";

function PrivacyPolicy() {
    const lastUpdated = "11 de novembro de 2025";

    return (
        <div className="privacy-policy">
            <Navbar />

            <div className="privacy-policy-container">
                <div className="privacy-policy-header">
                    <ShieldCheckIcon size={64} weight="duotone" />
                    <h1>Política de Privacidade</h1>
                    <p className="last-updated">Última atualização: {lastUpdated}</p>
                </div>

                <div className="privacy-policy-content">
                    <section className="policy-section">
                        <div className="section-icon">
                            <UserCircleIcon size={32} weight="duotone" />
                        </div>
                        <h2>1. Introdução</h2>
                        <p>
                            A <strong>Zele Church</strong> valoriza e respeita a privacidade dos seus membros e visitantes.
                            Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas
                            informações pessoais quando você utiliza nosso aplicativo e serviços.
                        </p>
                        <p>
                            Ao se cadastrar e utilizar nossos serviços, você concorda com as práticas descritas nesta política.
                        </p>
                    </section>

                    <section className="policy-section">
                        <div className="section-icon">
                            <EyeIcon size={32} weight="duotone" />
                        </div>
                        <h2>2. Informações que Coletamos</h2>

                        <h3>2.1. Informações Pessoais</h3>
                        <p>Coletamos as seguintes informações quando você se cadastra:</p>
                        <ul>
                            <li>Nome completo</li>
                            <li>Endereço de e-mail</li>
                            <li>Número de telefone</li>
                            <li>Data de nascimento</li>
                            <li>CPF (opcional)</li>
                            <li>Gênero</li>
                            <li>Estado civil</li>
                            <li>Endereço residencial</li>
                            <li>Foto de perfil (opcional)</li>
                            <li>Informações sobre batismo</li>
                        </ul>

                        <h3>2.2. Informações de Uso</h3>
                        <p>Coletamos automaticamente informações sobre como você usa nosso aplicativo:</p>
                        <ul>
                            <li>Dados de acesso (endereço IP, tipo de navegador, sistema operacional)</li>
                            <li>Páginas visitadas e recursos utilizados</li>
                            <li>Data e horário de acesso</li>
                            <li>Informações de localização (se permitido)</li>
                        </ul>

                        <h3>2.3. Comunicações</h3>
                        <p>Registramos comunicações que você tem conosco, incluindo:</p>
                        <ul>
                            <li>E-mails enviados e recebidos</li>
                            <li>Mensagens via WhatsApp (quando aplicável)</li>
                            <li>Interações com nossa equipe pastoral</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <div className="section-icon">
                            <LockKeyIcon size={32} weight="duotone" />
                        </div>
                        <h2>3. Como Usamos suas Informações</h2>

                        <p>Utilizamos suas informações pessoais para:</p>
                        <ul>
                            <li><strong>Gestão de Membros:</strong> Administrar seu cadastro e participação em atividades da igreja</li>
                            <li><strong>Comunicação:</strong> Enviar atualizações sobre eventos, cultos, avisos importantes e conteúdos relevantes</li>
                            <li><strong>Autenticação:</strong> Permitir acesso seguro ao sistema através de login e senha</li>
                            <li><strong>Notificações:</strong> Enviar lembretes e confirmações via e-mail ou WhatsApp</li>
                            <li><strong>Pastoral:</strong> Facilitar o cuidado pastoral e acompanhamento espiritual</li>
                            <li><strong>Estatísticas:</strong> Gerar relatórios anônimos para fins administrativos e de planejamento</li>
                            <li><strong>Segurança:</strong> Proteger a integridade do sistema e prevenir fraudes</li>
                            <li><strong>Compliance:</strong> Cumprir obrigações legais e regulatórias</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>4. Compartilhamento de Informações</h2>

                        <p>
                            A Zele Church <strong>não vende, aluga ou comercializa</strong> suas informações pessoais com terceiros.
                        </p>

                        <h3>4.1. Compartilhamento Interno</h3>
                        <p>Suas informações podem ser acessadas por:</p>
                        <ul>
                            <li>Líderes e pastores da igreja (para fins de cuidado pastoral)</li>
                            <li>Administradores do sistema (para fins técnicos e de suporte)</li>
                            <li>Equipe administrativa (para fins de gestão e organização)</li>
                        </ul>

                        <h3>4.2. Provedores de Serviço</h3>
                        <p>Podemos compartilhar informações com terceiros que prestam serviços em nosso nome:</p>
                        <ul>
                            <li><strong>Hospedagem:</strong> Servidores e infraestrutura de nuvem</li>
                            <li><strong>E-mail:</strong> Serviços de envio de e-mails (Brevo/Sendinblue)</li>
                            <li><strong>WhatsApp:</strong> Meta/Facebook (WhatsApp Business API)</li>
                            <li><strong>Armazenamento:</strong> Cloudflare R2 (para fotos de perfil)</li>
                        </ul>
                        <p className="note">
                            Todos os provedores são obrigados a manter confidencialidade e usar dados apenas conforme instruído.
                        </p>

                        <h3>4.3. Requisitos Legais</h3>
                        <p>Podemos divulgar suas informações se legalmente obrigados:</p>
                        <ul>
                            <li>Ordem judicial ou requisição de autoridade competente</li>
                            <li>Proteção de direitos, propriedade ou segurança da igreja</li>
                            <li>Investigação de fraude ou violações de termos</li>
                        </ul>
                    </section>

                    <section className="policy-section">
                        <h2>5. Segurança das Informações</h2>

                        <p>Implementamos medidas técnicas e organizacionais para proteger suas informações:</p>
                        <ul>
                            <li><strong>Criptografia:</strong> Conexões HTTPS e senhas criptografadas (bcrypt)</li>
                            <li><strong>Controle de Acesso:</strong> Acesso restrito apenas a pessoal autorizado</li>
                            <li><strong>Autenticação:</strong> Sistema de login seguro com tokens JWT</li>
                            <li><strong>Backups:</strong> Cópias de segurança regulares dos dados</li>
                            <li><strong>Monitoramento:</strong> Logs de acesso e auditoria de atividades</li>
                            <li><strong>Atualização:</strong> Software e sistemas mantidos atualizados</li>
                        </ul>
                        <p className="note">
                            Apesar de nossos esforços, nenhum sistema é 100% seguro. Você também tem responsabilidade
                            em manter sua senha confidencial e não compartilhá-la com terceiros.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>6. Retenção de Dados</h2>

                        <p>Mantemos suas informações pessoais enquanto:</p>
                        <ul>
                            <li>Você for membro ativo da Zele Church</li>
                            <li>Necessário para cumprir obrigações legais</li>
                            <li>Para resolver disputas e fazer cumprir acordos</li>
                        </ul>
                        <p>
                            Se você solicitar exclusão de sua conta, removeremos ou anonimizaremos seus dados pessoais,
                            exceto quando legalmente obrigados a mantê-los.
                        </p>
                    </section>

                    <section className="policy-section">
                        <div className="section-icon">
                            <BellIcon size={32} weight="duotone" />
                        </div>
                        <h2>7. Seus Direitos</h2>

                        <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
                        <ul>
                            <li><strong>Acesso:</strong> Solicitar cópia dos seus dados pessoais</li>
                            <li><strong>Correção:</strong> Atualizar informações incorretas ou incompletas</li>
                            <li><strong>Exclusão:</strong> Solicitar remoção dos seus dados (direito ao esquecimento)</li>
                            <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                            <li><strong>Oposição:</strong> Opor-se ao processamento de seus dados</li>
                            <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
                            <li><strong>Informação:</strong> Saber com quem compartilhamos seus dados</li>
                        </ul>
                        <p>
                            Para exercer seus direitos, entre em contato através de: <strong>privacidade@zelechurch.com</strong>
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>8. Cookies e Tecnologias Similares</h2>

                        <p>Nosso aplicativo utiliza cookies e tecnologias similares para:</p>
                        <ul>
                            <li>Manter sua sessão autenticada</li>
                            <li>Lembrar suas preferências</li>
                            <li>Analisar uso do aplicativo</li>
                            <li>Melhorar experiência do usuário</li>
                        </ul>
                        <p>
                            Você pode configurar seu navegador para recusar cookies, mas isso pode afetar
                            a funcionalidade do aplicativo.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>9. Menores de Idade</h2>

                        <p>
                            Nosso serviço é destinado a pessoas maiores de 18 anos. Se você for menor de idade,
                            é necessário autorização dos pais ou responsáveis para cadastro.
                        </p>
                        <p>
                            Caso tomemos conhecimento de coleta inadvertida de dados de menores sem consentimento,
                            tomaremos medidas para deletar tais informações.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>10. Links para Sites Externos</h2>

                        <p>
                            Nosso aplicativo pode conter links para sites externos (redes sociais, YouTube, etc.).
                            Não somos responsáveis pelas práticas de privacidade desses sites.
                            Recomendamos ler suas políticas de privacidade.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>11. Alterações nesta Política</h2>

                        <p>
                            Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre
                            mudanças significativas através de:
                        </p>
                        <ul>
                            <li>Aviso no aplicativo</li>
                            <li>E-mail para membros cadastrados</li>
                            <li>Atualização da data "Última atualização" no topo desta página</li>
                        </ul>
                        <p>
                            Recomendamos revisar esta política regularmente para estar informado sobre como
                            protegemos suas informações.
                        </p>
                    </section>

                    <section className="policy-section">
                        <h2>12. Transferência Internacional de Dados</h2>

                        <p>
                            Alguns de nossos provedores de serviço podem estar localizados fora do Brasil.
                            Quando isso ocorre, garantimos que:
                        </p>
                        <ul>
                            <li>O país de destino oferece nível adequado de proteção</li>
                            <li>Cláusulas contratuais garantem proteção equivalente à LGPD</li>
                            <li>Medidas de segurança apropriadas estão implementadas</li>
                        </ul>
                    </section>

                    <section className="policy-section contact-section">
                        <h2>13. Contato</h2>

                        <p>Para questões sobre esta Política de Privacidade ou sobre o tratamento de seus dados:</p>

                        <div className="contact-info">
                            <div className="contact-item">
                                <strong>Encarregado de Dados (DPO):</strong>
                                <p>Zele Church - Proteção de Dados</p>
                            </div>

                            <div className="contact-item">
                                <strong>E-mail:</strong>
                                <p>secretaria@zelechurch.com.br</p>
                            </div>

                            <div className="contact-item">
                                <strong>Telefone:</strong>
                                <p>(11) 98945-1283</p>
                            </div>

                            <div className="contact-item">
                                <strong>Endereço:</strong>
                                <p>
                                    Avenida Jacu-Pêssego, 7639<br />
                                    Itaquera - SP<br />
                                    CEP: 08260-005
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="policy-section acknowledgment">
                        <p className="highlight">
                            Ao utilizar nossos serviços, você reconhece que leu, compreendeu e concorda com
                            esta Política de Privacidade.
                        </p>
                    </section>
                </div>

                <div className="privacy-policy-footer">
                    <p>© {new Date().getFullYear()} Zele Church. Todos os direitos reservados.</p>
                    <div className="footer-links">
                        <a href="/terms-of-service">Termos de Serviço</a>
                        <span>•</span>
                        <a href="/">Voltar ao Início</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
