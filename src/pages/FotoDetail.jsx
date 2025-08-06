import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import fotoService from '../services/fotoService';

function FotoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [foto, setFoto] = useState({ foto: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        if (id) {
            const fetchFoto = async () => {
                setLoading(true);
                try {
                    const response = await fotoService.getById(id);
                    setFoto(response.data);
                } catch (err) {
                    console.error("Erro ao buscar foto:", err);
                    setError("Erro ao carregar os dados da foto.");
                } finally {
                    setLoading(false);
                }
            };
            fetchFoto();
        } else {
            setLoading(false);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFoto(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await fotoService.update(id, foto);
                setModalMessage("Foto atualizada com sucesso!");
            } else {
                await fotoService.create(foto);
                setModalMessage("Foto criada com sucesso!");
            }
            setShowModal(true);
            setTimeout(() => navigate('/fotos'), 2000);
        } catch (err) {
            console.error("Erro ao salvar foto:", err);
            setModalMessage("Erro ao salvar foto.");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (loading) return <div className="text-center p-4">Carregando dados da foto...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="form-container">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Foto' : 'Nova Foto'}</h2>
            <form onSubmit={handleSubmit}>
                {id && (
                    <div className="form-field">
                        <label className="form-label">ID:</label>
                        <input type="text" name="id" value={id} readOnly className="form-input" />
                    </div>
                )}
                <div className="form-field">
                    <label className="form-label">URL da Foto:</label>
                    <input type="text" name="foto" value={foto.foto} onChange={handleChange} className="form-input" />
                </div>
                
                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/fotos')} className="cancel-button">
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

export default FotoDetail;
