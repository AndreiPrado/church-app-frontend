import "./member-card-page.component.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import authService from "../../services/authService";
import AdminLayout from "../admin-layout/admin-layout.component";
import LoadingSpinner from "../loading-spinner/loading-spinner.component";
import MemberCard from "../member-card/member-card.component";
import { ArrowLeftIcon, IdentificationCardIcon } from "@phosphor-icons/react";

export default function MemberCardPage() {
    const { user, getToken } = useAuth();
    const navigate = useNavigate();
    const [memberData, setMemberData] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMemberData = async () => {
            try {
                setLoading(true);
                const token = getToken();
                const data = await authService.getMemberById(user.id, token);
                setMemberData(data);

                // Carregar foto do membro
                try {
                    const blob = await authService.getMemberPhoto(user.id);
                    if (blob) {
                        const blobUrl = URL.createObjectURL(blob);
                        setPhotoUrl(blobUrl);
                    }
                } catch (photoErr) {
                    console.warn('Não foi possível carregar foto:', photoErr);
                    setPhotoUrl(null);
                }
            } catch (error) {
                console.error('Erro ao carregar dados do membro:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            loadMemberData();
        }
    }, [user, getToken]);

    if (loading) {
        return (
            <AdminLayout>
                <div className="member-card-page loading">
                    <LoadingSpinner message="Carregando carteirinha..." />
                </div>
            </AdminLayout>
        );
    }

    if (!memberData) {
        return (
            <AdminLayout>
                <div className="member-card-page error">
                    <h2>Erro ao carregar carteirinha</h2>
                    <button onClick={() => navigate('/admin/profile')} className="back-btn">
                        Voltar para Minha Conta
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="member-card-page">
                <div className="page-header">
                    <div className="header-title">
                        <IdentificationCardIcon size={32} weight="duotone" />
                        <div>
                            <h1>Minha Carteirinha</h1>
                            <p>Carteirinha digital de membro da igreja</p>
                        </div>
                    </div>

                    <button onClick={() => navigate('/admin/profile')} className="back-button">
                        <ArrowLeftIcon size={20} weight="bold" />
                        Voltar
                    </button>
                </div>

                <div className="card-container">
                    <MemberCard
                        name={memberData.fullName}
                        memberId={memberData.id}
                        memberNumber={memberData.memberNumber}
                        status={memberData.status}
                        joinedAt={memberData.joinedAt}
                        expiresAt={memberData.expiresAt}
                        photoUrl={photoUrl}
                        churchName="Zele Church"
                        validationUrl={`${window.location.origin}/validar-membro`}
                    />
                </div>
            </div>
        </AdminLayout>
    );
}
