import "./dashboard.component.scss";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import AdminLayout from "../admin-layout/admin-layout.component";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import AccessDenied from "../access-denied/access-denied.component";
import {
  UsersIcon,
  UserCheckIcon,
  UserPlusIcon,
  TrendUpIcon,
  GenderMaleIcon,
  GenderFemaleIcon,
  ChartPieSliceIcon,
  CheckCircleIcon,
  ArrowClockwiseIcon,
  ChartBarIcon,
  HandHeartIcon
} from "@phosphor-icons/react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.getStatistics();
      setStatistics(data);
    } catch (err) {
      // Capturar erro 403 (sem permissão) e outros erros
      const errorData = err.response?.data;
      const statusCode = err.response?.status;

      setError({
        message: errorData?.error || errorData?.detail || err.message || "Erro ao carregar estatísticas",
        detail: errorData?.detail,
        statusCode: statusCode,
        isAccessDenied: statusCode === 403
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSpinner message="Carregando estatísticas..." />
      </AdminLayout>
    );
  }

  if (error) {
    // Se é erro de permissão (403), mostrar página de acesso negado
    if (error.isAccessDenied) {
      return (
        <AdminLayout>
          <AccessDenied message={error.message} detail={error.detail} />
        </AdminLayout>
      );
    }

    // Outros erros
    return (
      <AdminLayout>
        <div className="dashboard-error">
          <p>{error.message}</p>
          <button onClick={loadStatistics}>
            <ArrowClockwiseIcon size={20} weight="bold" />
            Tentar novamente
          </button>
        </div>
      </AdminLayout>
    );
  }

  // API retorna: { total, active, pending, baptized, newConverts, byGender: { masculino, feminino }, byAge: { under13, between13and17, between18and25, between26and35, between36and50, between51and65, over65 } }
  const stats = statistics || {
    total: 0,
    active: 0,
    pending: 0,
    baptized: 0,
    newConverts: 0,
    byGender: { masculino: 0, feminino: 0 },
    byAge: { under13: 0, between13and17: 0, between18and25: 0, between26and35: 0, between36and50: 0, between51and65: 0, over65: 0 }
  };

  return (
    <AdminLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <ChartBarIcon size={32} weight="duotone" />
          <div>
            <h1>Dashboard</h1>
            <p>Visão geral dos membros da igreja</p>
          </div>
        </div>

        {/* Seção: Membros por Status */}
        <div className="dashboard-section">
          <h2 className="section-title">Membros por Status</h2>
          <div className="stats-grid">
            <div className="stat-card success" onClick={() => navigate('/admin/members?status=ativo')}>
              <div className="stat-icon">
                <UserCheckIcon size={32} weight="duotone" />
              </div>
              <div className="stat-content">
                <span className="stat-label">Ativos</span>
                <span className="stat-value">{stats.active}</span>
              </div>
            </div>

            <div className="stat-card warning" onClick={() => navigate('/admin/members?status=pendente')}>
              <div className="stat-icon">
                <UserPlusIcon size={32} weight="duotone" />
              </div>
              <div className="stat-content">
                <span className="stat-label">Pendentes</span>
                <span className="stat-value">{stats.pending || 0}</span>
              </div>
            </div>

            <div className="stat-card info" onClick={() => navigate('/admin/members?status=visitante')}>
              <div className="stat-icon">
                <UsersIcon size={32} weight="duotone" />
              </div>
              <div className="stat-content">
                <span className="stat-label">Visitantes</span>
                <span className="stat-value">{stats.total - stats.active - stats.pending - (stats.newConverts || 0)}</span>
              </div>
            </div>

            <div className="stat-card new-convert" onClick={() => navigate('/admin/members?status=novo_convertido')}>
              <div className="stat-icon">
                <HandHeartIcon size={32} weight="duotone" />
              </div>
              <div className="stat-content">
                <span className="stat-label">Novos Convertidos</span>
                <span className="stat-value">{stats.newConverts || 0}</span>
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <button className="action-btn primary" onClick={() => navigate('/new-believer')}>
              <HandHeartIcon size={20} weight="fill" />
              Cadastrar Novo Convertido
            </button>
          </div>
        </div>

        {/* Seção: Distribuições */}
        <div className="dashboard-section">
          <h2 className="section-title">Distribuições</h2>
          <div className="charts-grid">
            {/* Gráfico por Gênero */}
            <div className="chart-card">
              <div className="chart-header">
                <ChartPieSliceIcon size={24} weight="duotone" />
                <h3>Distribuição por Gênero</h3>
              </div>
              <div className="gender-chart">
                <div className="gender-item">
                  <GenderMaleIcon size={32} weight="duotone" style={{ color: '#42a5f5' }} />
                  <div className="gender-info">
                    <span className="gender-label">Masculino</span>
                    <span className="gender-value" style={{ color: '#42a5f5' }}>{stats.byGender?.masculino || 0}</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill male"
                        style={{
                          width: `${stats.total > 0 ? (stats.byGender?.masculino || 0) / stats.total * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="gender-item">
                  <GenderFemaleIcon size={32} weight="duotone" style={{ color: '#e91e63' }} />
                  <div className="gender-info">
                    <span className="gender-label">Feminino</span>
                    <span className="gender-value" style={{ color: '#e91e63' }}>{stats.byGender?.feminino || 0}</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill female"
                        style={{
                          width: `${stats.total > 0 ? (stats.byGender?.feminino || 0) / stats.total * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gráfico por Faixa Etária */}
            <div className="chart-card">
              <div className="chart-header">
                <ChartPieSliceIcon size={24} weight="duotone" />
                <h3>Distribuição por Idade</h3>
              </div>
              <div className="age-chart">
                {[
                  { key: 'under13', label: 'Crianças (0-12 anos)', color: '#FF6B9D' },
                  { key: 'between13and17', label: 'Adolescentes (13-17 anos)', color: '#C44569' },
                  { key: 'between18and25', label: 'Jovens (18-25 anos)', color: '#FFA726' },
                  { key: 'between26and35', label: 'Adultos Jovens (26-35 anos)', color: '#42A5F5' },
                  { key: 'between36and50', label: 'Adultos (36-50 anos)', color: '#66BB6A' },
                  { key: 'between51and65', label: 'Meia-idade (51-65 anos)', color: '#AB47BC' },
                  { key: 'over65', label: 'Idosos (65+ anos)', color: '#78909C' }
                ].map(({ key, label, color }) => (
                  <div key={key} className="age-item">
                    <div className="age-info">
                      <span className="age-label">{label}</span>
                      <span className="age-value" style={{ color }}>{stats.byAge?.[key] || 0}</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${stats.total > 0 ? (stats.byAge?.[key] || 0) / stats.total * 100 : 0}%`,
                          background: `linear-gradient(90deg, ${color}, ${color}dd)`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Seção: Batismo */}
        <div className="dashboard-section">
          <h2 className="section-title">Estatísticas de Batismo</h2>
          <div className="baptism-stats">
            <div className="baptism-card" onClick={() => navigate('/admin/members?baptized=true')}>
              <div className="baptism-icon baptized">
                <CheckCircleIcon size={32} weight="fill" />
              </div>
              <div className="baptism-content">
                <span className="baptism-label">Batizados</span>
                <span className="baptism-value">{stats.baptized}</span>
              </div>
            </div>

            <div className="baptism-card" onClick={() => navigate('/admin/members?baptized=false')}>
              <div className="baptism-icon not-baptized">
                <CheckCircleIcon size={32} weight="duotone" />
              </div>
              <div className="baptism-content">
                <span className="baptism-label">Não Batizados</span>
                <span className="baptism-value">{stats.total - stats.baptized}</span>
              </div>
            </div>

            <div className="baptism-card">
              <div className="baptism-icon rate">
                <TrendUpIcon size={32} weight="fill" />
              </div>
              <div className="baptism-content">
                <span className="baptism-label">Taxa de Batismo</span>
                <span className="baptism-value">
                  {stats.total > 0 ? Math.round((stats.baptized / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
