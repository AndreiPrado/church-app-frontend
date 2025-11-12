import "./terms-of-service.component.scss";
import Navbar from '../navbar/navbar.component.jsx';
import { FileTextIcon, CheckCircleIcon, WarningCircleIcon, GavelIcon, HandshakeIcon } from "@phosphor-icons/react";

function TermsOfService() {
  const lastUpdated = "11 de novembro de 2025";

  return (
    <div className="terms-of-service">
      <Navbar />
      
      <div className="terms-of-service-container">
        <div className="terms-of-service-header">
          <FileTextIcon size={64} weight="duotone" />
          <h1>Termos de Serviço</h1>
          <p className="last-updated">Última atualização: {lastUpdated}</p>
        </div>

        <div className="terms-of-service-content">
          <section className="terms-section">
            <div className="section-icon">
              <HandshakeIcon size={32} weight="duotone" />
            </div>
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Bem-vindo à <strong>Zele Church</strong>! Ao acessar e utilizar nosso aplicativo e serviços, 
              você concorda em cumprir e estar vinculado aos seguintes Termos de Serviço.
            </p>
            <p>
              Se você não concorda com qualquer parte destes termos, por favor, não utilize nossos serviços.
            </p>
            <p className="note">
              <strong>Importante:</strong> Estes termos constituem um acordo legal entre você e a Zele Church. 
              Leia atentamente antes de prosseguir.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. Definições</h2>
            <p>Para fins destes Termos de Serviço:</p>
            <ul>
              <li><strong>"Igreja"</strong> ou <strong>"Nós"</strong>: Refere-se à Zele Church e seus representantes autorizados</li>
              <li><strong>"Aplicativo"</strong> ou <strong>"Serviço"</strong>: Sistema de gestão de membros da Zele Church</li>
              <li><strong>"Você"</strong> ou <strong>"Usuário"</strong>: Pessoa que se cadastra e utiliza nossos serviços</li>
              <li><strong>"Membro"</strong>: Usuário com cadastro aprovado pela liderança da igreja</li>
              <li><strong>"Conteúdo"</strong>: Informações, textos, imagens e dados fornecidos através do aplicativo</li>
              <li><strong>"Conta"</strong>: Perfil de usuário criado mediante cadastro e autenticação</li>
            </ul>
          </section>

          <section className="terms-section">
            <div className="section-icon">
              <CheckCircleIcon size={32} weight="duotone" />
            </div>
            <h2>3. Elegibilidade e Cadastro</h2>
            
            <h3>3.1. Requisitos de Idade</h3>
            <p>
              Para criar uma conta, você deve ter no mínimo 18 anos de idade. 
              Menores de 18 anos podem se cadastrar apenas com autorização expressa dos pais ou responsáveis legais.
            </p>

            <h3>3.2. Informações de Cadastro</h3>
            <p>Ao se cadastrar, você concorda em:</p>
            <ul>
              <li>Fornecer informações verdadeiras, precisas, atuais e completas</li>
              <li>Manter e atualizar prontamente suas informações para mantê-las verdadeiras e atualizadas</li>
              <li>Não se passar por outra pessoa ou entidade</li>
              <li>Não criar mais de uma conta pessoal</li>
              <li>Não criar conta usando informações falsas ou de terceiros</li>
            </ul>

            <h3>3.3. Aprovação de Cadastro</h3>
            <p>
              Seu cadastro será submetido à aprovação da liderança da igreja. Reservamo-nos o direito de 
              recusar, suspender ou cancelar cadastros a nosso critério, sem necessidade de justificativa.
            </p>
          </section>

          <section className="terms-section">
            <h2>4. Uso da Conta</h2>
            
            <h3>4.1. Responsabilidade pela Conta</h3>
            <p>Você é responsável por:</p>
            <ul>
              <li>Manter a confidencialidade de sua senha</li>
              <li>Todas as atividades que ocorrem em sua conta</li>
              <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
              <li>Garantir que faz logout ao final de cada sessão em dispositivos compartilhados</li>
            </ul>

            <h3>4.2. Uso Aceitável</h3>
            <p>Você concorda em usar nossos serviços apenas para fins legítimos e de acordo com estes Termos. 
            É proibido:</p>
            <ul>
              <li>Usar o serviço para qualquer finalidade ilegal ou não autorizada</li>
              <li>Violar quaisquer leis locais, estaduais, nacionais ou internacionais</li>
              <li>Transmitir conteúdo ofensivo, difamatório, obsceno ou prejudicial</li>
              <li>Assediar, intimidar, ameaçar ou prejudicar outros usuários</li>
              <li>Enviar spam ou mensagens não solicitadas</li>
              <li>Tentar obter acesso não autorizado ao sistema</li>
              <li>Interferir ou interromper o funcionamento do serviço</li>
              <li>Usar bots, scripts ou ferramentas automatizadas não autorizadas</li>
              <li>Copiar, modificar ou distribuir conteúdo sem permissão</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>5. Propriedade Intelectual</h2>
            
            <h3>5.1. Propriedade da Igreja</h3>
            <p>
              Todo o conteúdo do aplicativo, incluindo mas não limitado a textos, gráficos, logotipos, 
              ícones, imagens, clipes de áudio, downloads digitais e software, é propriedade da Zele Church 
              ou de seus fornecedores de conteúdo e protegido por leis de direitos autorais.
            </p>

            <h3>5.2. Licença de Uso</h3>
            <p>
              Concedemos a você uma licença limitada, não exclusiva, intransferível e revogável para 
              acessar e usar o aplicativo para fins pessoais e não comerciais.
            </p>

            <h3>5.3. Conteúdo do Usuário</h3>
            <p>
              Ao enviar conteúdo (fotos, comentários, etc.), você nos concede uma licença mundial, 
              não exclusiva e livre de royalties para usar, reproduzir e exibir tal conteúdo em 
              conexão com nossos serviços.
            </p>
          </section>

          <section className="terms-section">
            <h2>6. Privacidade e Proteção de Dados</h2>
            
            <p>
              Seu uso do serviço também é regido por nossa <a href="/privacy-policy">Política de Privacidade</a>, 
              que está incorporada a estes Termos por referência.
            </p>
            <p>
              Ao usar nossos serviços, você consente com a coleta, uso e compartilhamento de suas 
              informações conforme descrito em nossa Política de Privacidade.
            </p>
          </section>

          <section className="terms-section">
            <h2>7. Comunicações</h2>
            
            <h3>7.1. Consentimento para Comunicações</h3>
            <p>Ao se cadastrar, você consente em receber:</p>
            <ul>
              <li>E-mails sobre eventos, cultos e atividades da igreja</li>
              <li>Mensagens via WhatsApp relacionadas ao seu cadastro e participação</li>
              <li>Notificações sobre atualizações de serviço e política</li>
              <li>Comunicações administrativas necessárias</li>
            </ul>

            <h3>7.2. Cancelamento de Comunicações</h3>
            <p>
              Você pode optar por não receber comunicações promocionais a qualquer momento, 
              mas comunicações administrativas essenciais não podem ser desativadas enquanto 
              você mantiver uma conta ativa.
            </p>
          </section>

          <section className="terms-section">
            <div className="section-icon">
              <WarningCircleIcon size={32} weight="duotone" />
            </div>
            <h2>8. Suspensão e Encerramento</h2>
            
            <h3>8.1. Pela Igreja</h3>
            <p>Podemos suspender ou encerrar sua conta imediatamente, sem aviso prévio, se:</p>
            <ul>
              <li>Você violar estes Termos de Serviço</li>
              <li>Seu comportamento for prejudicial a outros membros ou à igreja</li>
              <li>Fornecer informações falsas ou enganosas</li>
              <li>Usar o serviço de forma fraudulenta ou ilegal</li>
              <li>A nosso critério, para proteger a integridade da comunidade</li>
            </ul>

            <h3>8.2. Por Você</h3>
            <p>
              Você pode encerrar sua conta a qualquer momento entrando em contato conosco. 
              O encerramento não afeta quaisquer direitos ou obrigações acumulados antes do encerramento.
            </p>

            <h3>8.3. Efeitos do Encerramento</h3>
            <p>Após o encerramento:</p>
            <ul>
              <li>Você perderá acesso à sua conta e ao conteúdo associado</li>
              <li>Podemos reter certas informações conforme exigido por lei</li>
              <li>Disposições que naturalmente sobrevivem ao encerramento permanecerão em vigor</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>9. Isenções de Garantia</h2>
            
            <p className="disclaimer">
              O SERVIÇO É FORNECIDO "COMO ESTÁ" E "CONFORME DISPONÍVEL", SEM GARANTIAS DE QUALQUER TIPO, 
              EXPRESSAS OU IMPLÍCITAS.
            </p>
            <p>Não garantimos que:</p>
            <ul>
              <li>O serviço estará sempre disponível ou livre de erros</li>
              <li>Os resultados obtidos serão precisos ou confiáveis</li>
              <li>Defeitos serão corrigidos em tempo específico</li>
              <li>O serviço atenderá suas necessidades ou expectativas</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>10. Limitação de Responsabilidade</h2>
            
            <p>
              Na extensão máxima permitida por lei, a Zele Church e seus representantes não serão 
              responsáveis por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais 
              ou punitivos resultantes de:
            </p>
            <ul>
              <li>Seu uso ou incapacidade de usar o serviço</li>
              <li>Acesso não autorizado ou alteração de suas transmissões ou dados</li>
              <li>Declarações ou conduta de terceiros no serviço</li>
              <li>Qualquer outra questão relacionada ao serviço</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>11. Indenização</h2>
            
            <p>
              Você concorda em defender, indenizar e isentar a Zele Church, seus diretores, funcionários 
              e agentes de qualquer reclamação, dano, obrigação, perda, responsabilidade, custo ou dívida 
              resultante de:
            </p>
            <ul>
              <li>Seu uso e acesso ao serviço</li>
              <li>Violação destes Termos</li>
              <li>Violação de direitos de terceiros</li>
              <li>Qualquer conteúdo que você enviar</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>12. Modificações do Serviço</h2>
            
            <p>
              Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer aspecto do 
              serviço a qualquer momento, com ou sem aviso prévio. Não seremos responsáveis por 
              quaisquer modificações, suspensões ou descontinuações.
            </p>
          </section>

          <section className="terms-section">
            <h2>13. Alterações nos Termos</h2>
            
            <p>
              Podemos revisar estes Termos de Serviço periodicamente. Mudanças significativas serão 
              notificadas através de:
            </p>
            <ul>
              <li>Aviso no aplicativo</li>
              <li>E-mail para sua conta cadastrada</li>
              <li>Atualização da data "Última atualização"</li>
            </ul>
            <p>
              Seu uso continuado após mudanças constitui aceitação dos novos termos. 
              Se não concordar, você deve parar de usar o serviço.
            </p>
          </section>

          <section className="terms-section">
            <div className="section-icon">
              <GavelIcon size={32} weight="duotone" />
            </div>
            <h2>14. Lei Aplicável e Jurisdição</h2>
            
            <p>
              Estes Termos serão regidos e interpretados de acordo com as leis da República Federativa 
              do Brasil, sem consideração a conflitos de disposições legais.
            </p>
            <p>
              Quaisquer disputas decorrentes destes Termos serão submetidas à jurisdição exclusiva dos 
              tribunais de São Paulo, SP, Brasil.
            </p>
          </section>

          <section className="terms-section">
            <h2>15. Disposições Gerais</h2>
            
            <h3>15.1. Acordo Integral</h3>
            <p>
              Estes Termos, juntamente com nossa Política de Privacidade, constituem o acordo integral 
              entre você e a Zele Church.
            </p>

            <h3>15.2. Divisibilidade</h3>
            <p>
              Se qualquer disposição destes Termos for considerada inválida, as demais disposições 
              permanecerão em pleno vigor e efeito.
            </p>

            <h3>15.3. Renúncia</h3>
            <p>
              A falha em fazer cumprir qualquer direito ou disposição destes Termos não constituirá 
              renúncia a tal direito ou disposição.
            </p>

            <h3>15.4. Cessão</h3>
            <p>
              Você não pode ceder ou transferir estes Termos sem nosso consentimento prévio por escrito. 
              Podemos ceder nossos direitos a qualquer momento.
            </p>

            <h3>15.5. Sobrevivência</h3>
            <p>
              Todas as disposições que, por sua natureza, devem sobreviver ao encerramento, 
              sobreviverão, incluindo mas não limitado a propriedade intelectual, isenções de garantia 
              e limitações de responsabilidade.
            </p>
          </section>

          <section className="terms-section contact-section">
            <h2>16. Contato</h2>
            
            <p>Para questões sobre estes Termos de Serviço:</p>
            
            <div className="contact-info">
              <div className="contact-item">
                <strong>Zele Church</strong>
                <p>Departamento Jurídico</p>
              </div>
              
              <div className="contact-item">
                <strong>E-mail:</strong>
                <p>legal@zelechurch.com</p>
              </div>
              
              <div className="contact-item">
                <strong>Telefone:</strong>
                <p>(11) 99999-9999</p>
              </div>
              
              <div className="contact-item">
                <strong>Endereço:</strong>
                <p>
                  Rua Exemplo, 123<br />
                  São Paulo - SP<br />
                  CEP: 00000-000
                </p>
              </div>
            </div>
          </section>

          <section className="terms-section acknowledgment">
            <p className="highlight">
              Ao criar uma conta e usar nossos serviços, você reconhece que leu, compreendeu e 
              concorda em estar vinculado a estes Termos de Serviço.
            </p>
          </section>
        </div>

        <div className="terms-of-service-footer">
          <p>© {new Date().getFullYear()} Zele Church. Todos os direitos reservados.</p>
          <div className="footer-links">
            <a href="/privacy-policy">Política de Privacidade</a>
            <span>•</span>
            <a href="/">Voltar ao Início</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;
