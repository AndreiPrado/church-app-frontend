import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Componente que faz scroll automático para o topo
 * apenas na PRIMEIRA vez que a rota muda
 * Evita conflitos com scroll manual do usuário
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Só faz scroll se a rota mudou (navegação entre páginas)
    // Não faz scroll se for a mesma página (evita bug no signup)
    if (prevPathname.current !== pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      prevPathname.current = pathname;
    }
  }, [pathname]);

  return null;
}
