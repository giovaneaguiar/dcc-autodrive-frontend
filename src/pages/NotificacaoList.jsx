import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import notificacaoService from '../services/notificacaoService';

function NotificacaoList() {
    const [notificacoes, setNotificacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [notificacaoToDelete, setNotificacaoToDelete] = useState(null);

    useEffect(() => {
        const fetchNotificacoes = async () => {
            try {
                const response = await notificacaoService.getAll();
                setNotificacoes(response.data);
            } catch (err) {
                console.error("Erro ao buscar notificações:", err);
                setError("Erro ao carregar notificações. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchNotificacoes();
    }, []);

    const confirmDelete = (notificacao) => {
        setNotificacaoToDelete(notificacao);
        setModalMessage(`Tem certeza que deseja excluir a notificação "${notificacao.titulo}"?`);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!notificacaoToDelete) return;
        try {
            await notificacaoService.delete(notificacaoToDelete.id);
            setNotificacoes(notificacoes.filter(notificacao => notificacao.id !== notificacaoToDelete.id));
            setModalMessage("Notificação excluída com sucesso!");
        } catch (err) {
            console.error("Erro ao excluir notificação:", err);
            setModalMessage("Erro ao excluir notificação.");
        } finally {
            setShowModal(false);
            setNotificacaoToDelete(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setNotificacaoToDelete(null);
    };

    if (loading) return <div className="loading-message">Carregando notificações...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (notificacoes.length === 0) return (
        <div className="no-data-message">
            <p>Nenhuma notificação encontrada.</p>
            <Link to="/notificacoes/new" className="add-button">
                Adicionar Nova Notificação
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Notificações</h2>
            <Link to="/notificacoes/new" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors">
                Adicionar Nova Notificação
            </Link>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="global-list-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                            <th>Data Criação</th>
                            <th>Usuário</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notificacoes.map((notificacao) => (
                            <tr key={notificacao.id}>
                                <td>{notificacao.id}</td>
                                <td>{notificacao.titulo || 'N/A'}</td>
                                <td>{notificacao.descricao || 'N/A'}</td>
                                <td>{notificacao.valor ? `R$ ${notificacao.valor.toFixed(2)}` : 'N/A'}</td>
                                <td>{notificacao.dataCriacao ? new Date(notificacao.dataCriacao).toLocaleDateString() : 'N/A'}</td>
                                <td>{notificacao.nomeUsuario || 'N/A'}</td>
                                <td>
                                    <Link to={`/notificacoes/edit/${notificacao.id}`} className="action-link">
                                        Editar
                                    </Link>
                                    <button onClick={() => confirmDelete(notificacao)} className="action-button">
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

export default NotificacaoList;
