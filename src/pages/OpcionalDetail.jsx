import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import opcionalService from '../services/opcionalService';

function OpcionalDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [opcional, setOpcional] = useState({
        descricao: '',
        arCondicionado: false,
        direcaoHidraulica: false,
        vidroEletrico: false,
        cameraRe: false,
        sensor: false,
        completo: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        if (id) {
            const fetchOpcional = async () => {
                setLoading(true);
                try {
                    const response = await opcionalService.getById(id);
                    setOpcional(response.data);
                } catch (err) {
                    console.error("Erro ao buscar opcional:", err);
                    setError("Erro ao carregar os dados do opcional.");
                } finally {
                    setLoading(false);
                }
            };
            fetchOpcional();
        } else {
            setLoading(false);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setOpcional(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await opcionalService.update(id, opcional);
                setModalMessage("Opcional atualizado com sucesso!");
            } else {
                await opcionalService.create(opcional);
                setModalMessage("Opcional criado com sucesso!");
            }
            setShowModal(true);
            setTimeout(() => navigate('/opcionais'), 2000);
        } catch (err) {
            console.error("Erro ao salvar opcional:", err);
            setModalMessage("Erro ao salvar opcional.");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (loading) return <div className="text-center p-4">Carregando dados do opcional...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="form-container">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Opcional' : 'Novo Opcional'}</h2>
            <form onSubmit={handleSubmit}>
                {id && (
                    <div className="form-field">
                        <label className="form-label">ID:</label>
                        <input type="text" name="id" value={id} readOnly className="form-input" />
                    </div>
                )}
                <div className="form-field">
                    <label className="form-label">Descrição:</label>
                    <input type="text" name="descricao" value={opcional.descricao} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">
                        Ar Condicionado:
                        <input type="checkbox" name="arCondicionado" checked={opcional.arCondicionado} onChange={handleChange} className="ml-2" />
                    </label>
                </div>
                <div className="form-field">
                    <label className="form-label">
                        Direção Hidráulica:
                        <input type="checkbox" name="direcaoHidraulica" checked={opcional.direcaoHidraulica} onChange={handleChange} className="ml-2" />
                    </label>
                </div>
                <div className="form-field">
                    <label className="form-label">
                        Vidro Elétrico:
                        <input type="checkbox" name="vidroEletrico" checked={opcional.vidroEletrico} onChange={handleChange} className="ml-2" />
                    </label>
                </div>
                <div className="form-field">
                    <label className="form-label">
                        Câmera de Ré:
                        <input type="checkbox" name="cameraRe" checked={opcional.cameraRe} onChange={handleChange} className="ml-2" />
                    </label>
                </div>
                <div className="form-field">
                    <label className="form-label">
                        Sensor:
                        <input type="checkbox" name="sensor" checked={opcional.sensor} onChange={handleChange} className="ml-2" />
                    </label>
                </div>
                <div className="form-field">
                    <label className="form-label">
                        Completo:
                        <input type="checkbox" name="completo" checked={opcional.completo} onChange={handleChange} className="ml-2" />
                    </label>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/opcionais')} className="cancel-button">
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

export default OpcionalDetail;
