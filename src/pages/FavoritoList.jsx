import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import favoritoService from '../services/favoritoService';

function FavoritoList() {
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [favoritoToDelete, setFavoritoToDelete] = useState(null);

    useEffect(() => {
        const fetchFavoritos = async () => {
            try {
                const response = await favoritoService.getAll();
                setFavoritos(response.data);
            } catch (err) {
                console.error("Erro ao buscar favoritos:", err);
                setError("Erro ao carregar favoritos. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchFavoritos();
    }, []);

    const confirmDelete = (favorito) => {
        setFavoritoToDelete(favorito);
        setModalMessage(`Tem certeza que deseja excluir o favorito ID: ${favorito.id}?`);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!favoritoToDelete) return;
        try {
            await favoritoService.delete(favoritoToDelete.id);
            setFavoritos(favoritos.filter(favorito => favorito.id !== favoritoToDelete.id));
            setModalMessage("Favorito excluído com sucesso!");
        } catch (err) {
            console.error("Erro ao excluir favorito:", err);
            setModalMessage("Erro ao excluir favorito.");
        } finally {
            setShowModal(false);
            setFavoritoToDelete(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setFavoritoToDelete(null);
    };

    if (loading) return <div className="loading-message">Carregando favoritos...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (favoritos.length === 0) return (
        <div className="no-data-message">
            <p>Nenhum favorito encontrado.</p>
            <Link to="/favoritos/new" className="add-button">
                Adicionar Novo Favorito
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Favoritos</h2>
            <Link to="/favoritos/new" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors">
                Adicionar Novo Favorito
            </Link>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="global-list-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Data Favorito</th>
                            <th>Descrição</th>
                            <th>Usuário</th>
                            <th>Veículo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {favoritos.map((favorito) => (
                            <tr key={favorito.id}>
                                <td>{favorito.id}</td>
                                <td>{favorito.dataFavorito ? new Date(favorito.dataFavorito).toLocaleDateString() : 'N/A'}</td>
                                <td>{favorito.descricao || 'N/A'}</td>
                                <td>{favorito.usuario ? favorito.usuario.nome : 'N/A'}</td> {/* Assumindo que Usuario tem um campo 'nome' */}
                                <td>{favorito.veiculo ? favorito.veiculo.modelo : 'N/A'}</td> {/* Assumindo que Veiculo tem um campo 'modelo' */}
                                <td>
                                    <Link to={`/favoritos/edit/${favorito.id}`} className="action-link">
                                        Editar
                                    </Link>
                                    <button onClick={() => confirmDelete(favorito)} className="action-button">
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

export default FavoritoList;
