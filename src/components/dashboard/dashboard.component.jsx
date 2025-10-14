import "./dashboard.component.scss";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import authService from "../../services/authService";
import AdminLayout from "../admin-layout/admin-layout.component";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import {
  Users,
  UserCheck,
  UserPlus,
  TrendUp,
  CalendarBlank,
  GenderMale,
  GenderFemale,
  ChartPieSlice,
  CheckCircle,
  XCircle
} from "@phosphor-icons/react";

export default function Dashboard() {
  const { getToken } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStatistics = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      const data = await authService.getStatistics(token);
      setStatistics(data);
    } catch (err) {
      setError(err.message || "Erro ao carregar estatísticas");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

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
    return (
      <AdminLayout>
        <div className="dashboard-error">
          <p>{error}</p>
          <button onClick={loadStatistics}>Tentar novamente</button>
        </div>
      </AdminLayout>
    );
  }

  // API retorna: { total, active, baptized, byGender: { masculino, feminino }, byAge: { under18, between18and35, between36and60, over60 } }
  const stats = statistics || {
    total: 0,
    active: 0,
    baptized: 0,
    byGender: { masculino: 0, feminino: 0 },
    byAge: { under18: 0, between18and35: 0, between36and60: 0, over60: 0 }
  };

  return (
    <AdminLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Visão geral dos membros da igreja</p>
        </div>

        {/* Cards de Resumo */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">
              <Users size={32} weight="duotone" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total de Membros</span>
              <span className="stat-value">{stats.total}</span>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">
              <UserCheck size={32} weight="duotone" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Membros Ativos</span>
              <span className="stat-value">{stats.active}</span>
            </div>
          </div>

          <div className="stat-card info">
            <div className="stat-icon">
              <UserPlus size={32} weight="duotone" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Batizados</span>
              <span className="stat-value">{stats.baptized}</span>
            </div>
          </div>

          <div className="stat-card growth">
            <div className="stat-icon">
              <TrendUp size={32} weight="duotone" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Taxa de Batismo</span>
              <span className="stat-value">
                {stats.total > 0 ? Math.round((stats.baptized / stats.total) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="charts-grid">
          {/* Gráfico por Gênero */}
          <div className="chart-card">
            <div className="chart-header">
              <ChartPieSlice size={24} weight="duotone" />
              <h3>Distribuição por Gênero</h3>
            </div>
            <div className="gender-chart">
              <div className="gender-item">
                <GenderMale size={32} weight="duotone" />
                <div className="gender-info">
                  <span className="gender-label">Masculino</span>
                  <span className="gender-value">{stats.byGender?.masculino || 0}</span>
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
                <GenderFemale size={32} weight="duotone" />
                <div className="gender-info">
                  <span className="gender-label">Feminino</span>
                  <span className="gender-value">{stats.byGender?.feminino || 0}</span>
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
              <ChartPieSlice size={24} weight="duotone" />
              <h3>Distribuição por Idade</h3>
            </div>
            <div className="age-chart">
              {[
                { key: 'under18', label: 'Menores de 18 anos' },
                { key: 'between18and35', label: '18 a 35 anos' },
                { key: 'between36and60', label: '36 a 60 anos' },
                { key: 'over60', label: 'Acima de 60 anos' }
              ].map(({ key, label }) => (
                <div key={key} className="age-item">
                  <div className="age-info">
                    <span className="age-label">{label}</span>
                    <span className="age-value">{stats.byAge?.[key] || 0}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${stats.total > 0 ? (stats.byAge?.[key] || 0) / stats.total * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumo de Batismos */}
          <div className="chart-card full-width">
            <div className="chart-header">
              <CalendarBlank size={24} weight="duotone" />
              <h3>Estatísticas de Batismo</h3>
            </div>
            <div className="baptism-stats">
              <div className="baptism-item">
                <div className="baptism-icon baptized">
                  <CheckCircle size={32} weight="duotone" />
                </div>
                <div className="baptism-info">
                  <span className="baptism-value">{stats.baptized}</span>
                  <span className="baptism-label">Batizados</span>
                </div>
              </div>
              <div className="baptism-item">
                <div className="baptism-icon not-baptized">
                  <XCircle size={32} weight="duotone" />
                </div>
                <div className="baptism-info">
                  <span className="baptism-value">{stats.total - stats.baptized}</span>
                  <span className="baptism-label">Não Batizados</span>
                </div>
              </div>
              <div className="baptism-item">
                <div className="baptism-icon percentage">
                  <TrendUp size={32} weight="duotone" />
                </div>
                <div className="baptism-info">
                  <span className="baptism-value">
                    {stats.total > 0 ? Math.round((stats.baptized / stats.total) * 100) : 0}%
                  </span>
                  <span className="baptism-label">Taxa de Batismo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
