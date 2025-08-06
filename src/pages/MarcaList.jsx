import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import marcaService from '../services/marcaService';

function MarcaList() {
    const [marcas, setMarcas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [marcaToDelete, setMarcaToDelete] = useState(null);

    useEffect(() => {
        const fetchMarcas = async () => {
            try {
                const response = await marcaService.getAll();
                setMarcas(response.data);
            } catch (err) {
                console.error("Erro ao buscar marcas:", err);
                setError("Erro ao carregar marcas. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchMarcas();
    }, []);

    const confirmDelete = (marca) => {
        setMarcaToDelete(marca);
        setModalMessage(`Tem certeza que deseja excluir a marca "${marca.nome}"?`);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!marcaToDelete) return;
        try {
            await marcaService.delete(marcaToDelete.id);
            setMarcas(marcas.filter(marca => marca.id !== marcaToDelete.id));
            setModalMessage("Marca excluída com sucesso!");
        } catch (err) {
            console.error("Erro ao excluir marca:", err);
            setModalMessage("Erro ao excluir marca.");
        } finally {
            setShowModal(false);
            setMarcaToDelete(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setMarcaToDelete(null);
    };

    if (loading) return <div className="loading-message">Carregando marcas...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (marcas.length === 0) return (
        <div className="no-data-message">
            <p>Nenhuma marca encontrada.</p>
            <Link to="/marcas/new" className="add-button">
                Adicionar Nova Marca
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Marcas</h2>
            <Link to="/marcas/new" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors">
                Adicionar Nova Marca
            </Link>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="global-list-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marcas.map((marca) => (
                            <tr key={marca.id}>
                                <td>{marca.id}</td>
                                <td>{marca.nome || 'N/A'}</td>
                                <td>
                                    <Link to={`/marcas/edit/${marca.id}`} className="action-link">
                                        Editar
                                    </Link>
                                    <button onClick={() => confirmDelete(marca)} className="action-button">
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal customizado para confirmação de exclusão */}
            {showModal && (
                <div className="custom-modal-backdrop">
                    <div className="custom-modal-content">
                        <h3 className="text-lg font-bold">{modalMessage}</h3>
                        <div className="custom-modal-actions">
                            <button onClick={handleDelete} className="submit-button">
                                Confirmar
                            </button>
                            <button onClick={handleCancel} className="cancel-button">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MarcaList;
