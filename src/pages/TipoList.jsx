import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import tipoService from '../services/tipoService';

function TipoList() {
    const [tipos, setTipos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [tipoToDelete, setTipoToDelete] = useState(null);

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const response = await tipoService.getAll();
                setTipos(response.data);
            } catch (err) {
                console.error("Erro ao buscar tipos:", err);
                setError("Erro ao carregar tipos. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchTipos();
    }, []);

    const confirmDelete = (tipo) => {
        setTipoToDelete(tipo);
        setModalMessage(`Tem certeza que deseja excluir o tipo "${tipo.nome}"?`);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!tipoToDelete) return;
        try {
            await tipoService.delete(tipoToDelete.id);
            setTipos(tipos.filter(tipo => tipo.id !== tipoToDelete.id));
            setModalMessage("Tipo excluído com sucesso!");
        } catch (err) {
            console.error("Erro ao excluir tipo:", err);
            setModalMessage("Erro ao excluir tipo.");
        } finally {
            setShowModal(false);
            setTipoToDelete(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setTipoToDelete(null);
    };

    if (loading) return <div className="loading-message">Carregando tipos...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (tipos.length === 0) return (
        <div className="no-data-message">
            <p>Nenhum tipo encontrado.</p>
            <Link to="/tipos/new" className="add-button">
                Adicionar Novo Tipo
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Tipos</h2>
            <Link to="/tipos/new" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors">
                Adicionar Novo Tipo
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
                        {tipos.map((tipo) => (
                            <tr key={tipo.id}>
                                <td>{tipo.id}</td>
                                <td>{tipo.nome || 'N/A'}</td>
                                <td>
                                    <Link to={`/tipos/edit/${tipo.id}`} className="action-link">
                                        Editar
                                    </Link>
                                    <button onClick={() => confirmDelete(tipo)} className="action-button">
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

export default TipoList;
