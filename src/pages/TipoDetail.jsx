import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tipoService from '../services/tipoService';

function TipoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tipo, setTipo] = useState({ nome: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        if (id) {
            const fetchTipo = async () => {
                setLoading(true);
                try {
                    const response = await tipoService.getById(id);
                    setTipo(response.data);
                } catch (err) {
                    console.error("Erro ao buscar tipo:", err);
                    setError("Erro ao carregar os dados do tipo.");
                } finally {
                    setLoading(false);
                }
            };
            fetchTipo();
        } else {
            setLoading(false);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTipo(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await tipoService.update(id, tipo);
                setModalMessage("Tipo atualizado com sucesso!");
            } else {
                await tipoService.create(tipo);
                setModalMessage("Tipo criado com sucesso!");
            }
            setShowModal(true);
            setTimeout(() => navigate('/tipos'), 2000);
        } catch (err) {
            console.error("Erro ao salvar tipo:", err);
            setModalMessage("Erro ao salvar tipo.");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (loading) return <div className="text-center p-4">Carregando dados do tipo...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="form-container">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Tipo' : 'Novo Tipo'}</h2>
            <form onSubmit={handleSubmit}>
                {id && (
                    <div className="form-field">
                        <label className="form-label">ID:</label>
                        <input type="text" name="id" value={id} readOnly className="form-input" />
                    </div>
                )}
                <div className="form-field">
                    <label className="form-label">Nome:</label>
                    <input type="text" name="nome" value={tipo.nome} onChange={handleChange} className="form-input" />
                </div>
                
                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/tipos')} className="cancel-button">
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

export default TipoDetail;
