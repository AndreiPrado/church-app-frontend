import { useNavigate } from 'react-router-dom';
import { HouseIcon, ArrowLeftIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import './not-found.component.scss';

/**
 * Componente de página 404 - Página não encontrada
 */
const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/admin/profile');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found">
      <div className="not-found-content">
        <div className="not-found-icon">
          <MagnifyingGlassIcon size={80} weight="duotone" />
        </div>

        <h1>404</h1>
        <h2>Página Não Encontrada</h2>

        <p className="not-found-message">
          A página que você está procurando não existe ou foi movida.
        </p>

        <p className="not-found-tip">
          Verifique se o endereço está correto ou navegue para uma página válida.
        </p>

        <div className="not-found-actions">
          <button
            onClick={handleGoBack}
            className="btn-secondary"
          >
            <ArrowLeftIcon size={20} />
            Voltar
          </button>

          <button
            onClick={handleGoHome}
            className="btn-primary"
          >
            <HouseIcon size={20} />
            Ir para Início
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
