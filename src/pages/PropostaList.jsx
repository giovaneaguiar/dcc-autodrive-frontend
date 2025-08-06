import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import propostaService from '../services/propostaService';

function PropostaList() {
    const [propostas, setPropostas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [propostaToDelete, setPropostaToDelete] = useState(null);

    useEffect(() => {
        const fetchPropostas = async () => {
            try {
                const response = await propostaService.getAll();
                setPropostas(response.data);
            } catch (err) {
                console.error("Erro ao buscar propostas:", err);
                setError("Erro ao carregar propostas. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchPropostas();
    }, []);

    const confirmDelete = (proposta) => {
        setPropostaToDelete(proposta);
        setModalMessage(`Tem certeza que deseja excluir a proposta ID: ${proposta.id}?`);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!propostaToDelete) return;
        try {
            await propostaService.delete(propostaToDelete.id);
            setPropostas(propostas.filter(proposta => proposta.id !== propostaToDelete.id));
            setModalMessage("Proposta excluída com sucesso!");
        } catch (err) {
            console.error("Erro ao excluir proposta:", err);
            setModalMessage("Erro ao excluir proposta.");
        } finally {
            setShowModal(false);
            setPropostaToDelete(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setPropostaToDelete(null);
    };

    if (loading) return <div className="loading-message">Carregando propostas...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (propostas.length === 0) return (
        <div className="no-data-message">
            <p>Nenhuma proposta encontrada.</p>
            <Link to="/propostas/new" className="add-button">
                Adicionar Nova Proposta
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Propostas</h2>
            <Link to="/propostas/new" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors">
                Adicionar Nova Proposta
            </Link>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="global-list-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Descrição</th>
                            <th>Valor</th>
                            <th>Usuário</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {propostas.map((proposta) => (
                            <tr key={proposta.id}>
                                <td>{proposta.id}</td>
                                <td>{proposta.descricao || 'N/A'}</td>
                                <td>{proposta.valor ? `R$ ${proposta.valor.toFixed(2)}` : 'N/A'}</td>
                                <td>{proposta.nomeUsuario || 'N/A'}</td>
                                <td>
                                    <Link to={`/propostas/edit/${proposta.id}`} className="action-link">
                                        Editar
                                    </Link>
                                    <button onClick={() => confirmDelete(proposta)} className="action-button">
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

export default PropostaList;
