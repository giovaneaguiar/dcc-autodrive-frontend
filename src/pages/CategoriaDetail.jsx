import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import categoriaService from '../services/categoriaService';

function CategoriaDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categoria, setCategoria] = useState({ descricao: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        if (id) {
            const fetchCategoria = async () => {
                setLoading(true);
                try {
                    const response = await categoriaService.getById(id);
                    setCategoria(response.data);
                } catch (err) {
                    console.error("Erro ao buscar categoria:", err);
                    setError("Erro ao carregar os dados da categoria.");
                } finally {
                    setLoading(false);
                }
            };
            fetchCategoria();
        } else {
            setLoading(false);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoria(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await categoriaService.update(id, categoria);
                setModalMessage("Categoria atualizada com sucesso!");
            } else {
                await categoriaService.create(categoria);
                setModalMessage("Categoria criada com sucesso!");
            }
            setShowModal(true);
            setTimeout(() => navigate('/categorias'), 2000);
        } catch (err) {
            console.error("Erro ao salvar categoria:", err);
            setModalMessage("Erro ao salvar categoria.");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (loading) return <div className="text-center p-4">Carregando dados da categoria...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="form-container">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Categoria' : 'Nova Categoria'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label className="form-label">Descrição:</label>
                    <input type="text" name="descricao" value={categoria.descricao} onChange={handleChange} className="form-input" />
                </div>
                
                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/categorias')} className="cancel-button">
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

export default CategoriaDetail;
