import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import empresaService from '../services/empresaService';

function EmpresaDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [empresa, setEmpresa] = useState({ 
        nome: '', 
        cnpj: '', 
        logradouro: '', 
        numero: '', 
        complemento: '', 
        bairro: '', 
        cidade: '', 
        uf: '', 
        cep: '' 
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        if (id) {
            const fetchEmpresa = async () => {
                setLoading(true);
                try {
                    const response = await empresaService.getById(id);
                    setEmpresa(response.data);
                } catch (err) {
                    console.error("Erro ao buscar empresa:", err);
                    setError("Erro ao carregar os dados da empresa.");
                } finally {
                    setLoading(false);
                }
            };
            fetchEmpresa();
        } else {
            setLoading(false);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmpresa(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await empresaService.update(id, empresa);
                setModalMessage("Empresa atualizada com sucesso!");
            } else {
                await empresaService.create(empresa);
                setModalMessage("Empresa criada com sucesso!");
            }
            setShowModal(true);
            setTimeout(() => navigate('/empresas'), 2000);
        } catch (err) {
            console.error("Erro ao salvar empresa:", err);
            setModalMessage("Erro ao salvar empresa.");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (loading) return <div className="text-center p-4">Carregando dados da empresa...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="form-container">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Empresa' : 'Nova Empresa'}</h2>
            <form onSubmit={handleSubmit}>
                {id && (
                    <div className="form-field">
                        <label className="form-label">ID:</label>
                        <input type="text" name="id" value={id} readOnly className="form-input" />
                    </div>
                )}
                <div className="form-field">
                    <label className="form-label">Nome:</label>
                    <input type="text" name="nome" value={empresa.nome} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">CNPJ:</label>
                    <input type="text" name="cnpj" value={empresa.cnpj} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Logradouro:</label>
                    <input type="text" name="logradouro" value={empresa.logradouro} onChange={handleChange} className="form-input" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="form-field">
                        <label className="form-label">Número:</label>
                        <input type="text" name="numero" value={empresa.numero} onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-field">
                        <label className="form-label">Complemento:</label>
                        <input type="text" name="complemento" value={empresa.complemento} onChange={handleChange} className="form-input" />
                    </div>
                </div>
                <div className="form-field">
                    <label className="form-label">Bairro:</label>
                    <input type="text" name="bairro" value={empresa.bairro} onChange={handleChange} className="form-input" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="form-field">
                        <label className="form-label">Cidade:</label>
                        <input type="text" name="cidade" value={empresa.cidade} onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-field">
                        <label className="form-label">UF:</label>
                        <input type="text" name="uf" value={empresa.uf} onChange={handleChange} className="form-input" />
                    </div>
                    <div className="form-field">
                        <label className="form-label">CEP:</label>
                        <input type="text" name="cep" value={empresa.cep} onChange={handleChange} className="form-input" />
                    </div>
                </div>
                
                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/empresas')} className="cancel-button">
                        Voltar
                    </button>
                    <button type="submit" className="submit-button">
                        Salvar
                    </button>
                </div>
            </form>

            {showModal && (
                <div className="custom-modal-backdrop">
                    <div className="custom-modal-content">
                        <h3 className="text-lg font-bold">{modalMessage}</h3>
                        <div className="custom-modal-actions">
                            <button onClick={handleCloseModal} className="submit-button">
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmpresaDetail;
