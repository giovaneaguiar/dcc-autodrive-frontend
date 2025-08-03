import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import anuncioService from '../services/anuncioService';

function AnuncioDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [anuncio, setAnuncio] = useState({
        dataAnuncio: '',
        preco: '',
        descricao: '',
        foto: '',
        vendido: false
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        if (id) {
            const fetchAnuncio = async () => {
                setLoading(true);
                try {
                    const response = await anuncioService.getById(id);
                    setAnuncio(response.data);
                } catch (err) {
                    console.error("Erro ao buscar anúncio:", err);
                    setError("Erro ao carregar os dados do anúncio.");
                } finally {
                    setLoading(false);
                }
            };
            fetchAnuncio();
        } else {
            setLoading(false);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAnuncio(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await anuncioService.update(id, anuncio);
                setModalMessage("Anúncio atualizado com sucesso!");
            } else {
                await anuncioService.create(anuncio);
                setModalMessage("Anúncio criado com sucesso!");
            }
            setShowModal(true);
            setTimeout(() => navigate('/anuncios'), 2000);
        } catch (err) {
            console.error("Erro ao salvar anúncio:", err);
            setModalMessage("Erro ao salvar anúncio.");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (loading) return <div className="text-center p-4">Carregando dados do anúncio...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="form-container">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Anúncio' : 'Novo Anúncio'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label className="form-label">Data do Anúncio:</label>
                    <input type="date" name="dataAnuncio" value={anuncio.dataAnuncio} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Preço:</label>
                    <input type="number" name="preco" value={anuncio.preco} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Descrição:</label>
                    <textarea name="descricao" value={anuncio.descricao} onChange={handleChange} className="form-input"></textarea>
                </div>
                <div className="form-field">
                    <label className="form-label">Foto (URL):</label>
                    <input type="text" name="foto" value={anuncio.foto} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">
                        Vendido:
                        <input type="checkbox" name="vendido" checked={anuncio.vendido} onChange={handleChange} className="ml-2" />
                    </label>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/anuncios')} className="cancel-button">
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

export default AnuncioDetail;
