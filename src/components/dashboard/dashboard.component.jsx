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
  Clock,
  TrendUp,
  CalendarBlank,
  GenderMale,
  GenderFemale,
  ChartPieSlice
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

  const stats = statistics || {
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    byGender: { male: 0, female: 0 },
    byMaritalStatus: {},
    byMonth: [],
    recentMembers: []
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
              <span className="stat-label">Aprovados</span>
              <span className="stat-value">{stats.approved}</span>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">
              <Clock size={32} weight="duotone" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Pendentes</span>
              <span className="stat-value">{stats.pending}</span>
            </div>
          </div>

          <div className="stat-card growth">
            <div className="stat-icon">
              <TrendUp size={32} weight="duotone" />
            </div>
            <div className="stat-content">
              <span className="stat-label">Este Mês</span>
              <span className="stat-value">{stats.currentMonth || 0}</span>
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
                  <span className="gender-value">{stats.byGender?.male || 0}</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill male"
                      style={{ 
                        width: `${stats.total > 0 ? (stats.byGender?.male || 0) / stats.total * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="gender-item">
                <GenderFemale size={32} weight="duotone" />
                <div className="gender-info">
                  <span className="gender-label">Feminino</span>
                  <span className="gender-value">{stats.byGender?.female || 0}</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill female"
                      style={{ 
                        width: `${stats.total > 0 ? (stats.byGender?.female || 0) / stats.total * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Estado Civil */}
          <div className="chart-card">
            <div className="chart-header">
              <ChartPieSlice size={24} weight="duotone" />
              <h3>Estado Civil</h3>
            </div>
            <div className="marital-chart">
              {Object.entries(stats.byMaritalStatus || {}).map(([status, count]) => (
                <div key={status} className="marital-item">
                  <div className="marital-info">
                    <span className="marital-label">{status}</span>
                    <span className="marital-value">{count}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${stats.total > 0 ? count / stats.total * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cadastros por Mês */}
          <div className="chart-card full-width">
            <div className="chart-header">
              <CalendarBlank size={24} weight="duotone" />
              <h3>Cadastros nos Últimos 6 Meses</h3>
            </div>
            <div className="monthly-chart">
              {(stats.byMonth || []).map((item, index) => (
                <div key={index} className="month-item">
                  <div 
                    className="month-bar"
                    style={{ 
                      height: `${item.count > 0 ? Math.max(20, (item.count / Math.max(...stats.byMonth.map(m => m.count))) * 100) : 20}%` 
                    }}
                    title={`${item.count} cadastros`}
                  >
                    <span className="bar-value">{item.count}</span>
                  </div>
                  <span className="month-label">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Membros Recentes */}
        <div className="recent-members">
          <div className="section-header">
            <UserPlus size={24} weight="duotone" />
            <h3>Cadastros Recentes</h3>
          </div>
          <div className="members-list">
            {(stats.recentMembers || []).length === 0 ? (
              <p className="no-data">Nenhum cadastro recente</p>
            ) : (
              stats.recentMembers.map((member) => (
                <div key={member.id} className="member-item">
                  <div className="member-avatar">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.fullName} />
                    ) : (
                      <Users size={24} weight="duotone" />
                    )}
                  </div>
                  <div className="member-info">
                    <span className="member-name">{member.fullName}</span>
                    <span className="member-email">{member.email}</span>
                  </div>
                  <span className={`member-status ${member.status}`}>
                    {member.status === 'pendente' ? 'Pendente' : 
                     member.status === 'aprovado' ? 'Aprovado' : 'Rejeitado'}
                  </span>
                  <span className="member-date">
                    {new Date(member.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
