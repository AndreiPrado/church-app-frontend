import "./new-believer.component.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "@phosphor-icons/react";
import { IMaskInput } from "react-imask";
import FloatingAlert from "../floating-alert/floating-alert.component.jsx";
import LoadingSpinner from "../loading-spinner/loading-spinner.component.jsx";
import memberService from "../../services/memberService.js";

export default function NewBeliever() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState({ isVisible: false, message: '', type: '' });
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        baptized: null
    });

    const [fieldErrors, setFieldErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.fullName || formData.fullName.trim().length < 2) {
            errors.fullName = 'Nome completo é obrigatório';
        }

        if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
            errors.phone = 'Telefone é obrigatório';
        }

        if (formData.baptized === null) {
            errors.baptized = 'Selecione se já foi batizado';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setAlert({
                isVisible: true,
                message: 'Por favor, preencha todos os campos obrigatórios',
                type: 'error'
            });
            return;
        }

        setIsLoading(true);

        try {
            const submitData = {
                fullName: formData.fullName,
                phone: formData.phone.replace(/\D/g, ''),
                baptized: formData.baptized
            };

            await memberService.createNewBeliever(submitData);

            navigate('/new-believer/success', {
                state: {
                    believerData: {
                        fullName: formData.fullName,
                        phone: formData.phone,
                        baptized: formData.baptized
                    }
                }
            });

        } catch (error) {
            console.error('Erro ao cadastrar novo convertido:', error);
            setAlert({
                isVisible: true,
                message: error.message || 'Erro ao cadastrar novo convertido',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="new-believer-page">
            <div className="new-believer-container">
                <div className="new-believer-header">
                    <button
                        className="back-button"
                        onClick={() => navigate('/')}
                        type="button"
                    >
                        <ArrowLeft size={24} weight="bold" />
                    </button>
                    <div className="header-content">
                        <UserPlus size={48} weight="duotone" className="header-icon" />
                        <h1>Novo Convertido</h1>
                        <p>Cadastre uma pessoa que aceitou Jesus</p>
                    </div>
                </div>

                <form className="new-believer-form" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <div className="form-group">
                            <label htmlFor="fullName">
                                Nome Completo <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={fieldErrors.fullName ? 'error' : ''}
                                placeholder="Digite o nome completo"
                                autoFocus
                            />
                            {fieldErrors.fullName && (
                                <span className="error-message">{fieldErrors.fullName}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">
                                Telefone <span className="required">*</span>
                            </label>
                            <IMaskInput
                                mask="(00) 00000-0000"
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onAccept={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                                className={fieldErrors.phone ? 'error' : ''}
                                placeholder="(00) 00000-0000"
                            />
                            {fieldErrors.phone && (
                                <span className="error-message">{fieldErrors.phone}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>
                                Já foi batizado? <span className="required">*</span>
                            </label>
                            <div className="radio-group">
                                <label className={`radio-option ${formData.baptized === true ? 'selected' : ''} ${fieldErrors.baptized ? 'error' : ''}`}>
                                    <input
                                        type="radio"
                                        name="baptized"
                                        value="true"
                                        checked={formData.baptized === true}
                                        onChange={() => {
                                            setFormData(prev => ({ ...prev, baptized: true }));
                                            if (fieldErrors.baptized) {
                                                setFieldErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.baptized;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                    />
                                    <span className="radio-label">Sim</span>
                                </label>
                                <label className={`radio-option ${formData.baptized === false ? 'selected' : ''} ${fieldErrors.baptized ? 'error' : ''}`}>
                                    <input
                                        type="radio"
                                        name="baptized"
                                        value="false"
                                        checked={formData.baptized === false}
                                        onChange={() => {
                                            setFormData(prev => ({ ...prev, baptized: false }));
                                            if (fieldErrors.baptized) {
                                                setFieldErrors(prev => {
                                                    const newErrors = { ...prev };
                                                    delete newErrors.baptized;
                                                    return newErrors;
                                                });
                                            }
                                        }}
                                    />
                                    <span className="radio-label">Não</span>
                                </label>
                            </div>
                            {fieldErrors.baptized && (
                                <span className="error-message">{fieldErrors.baptized}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate('/')}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={isLoading}
                        >
                            {isLoading ? <LoadingSpinner size="small" /> : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            </div>

            <FloatingAlert
                message={alert.message}
                type={alert.type}
                isVisible={alert.isVisible}
                onClose={() => setAlert({ ...alert, isVisible: false })}
            />
        </div>
    );
}
