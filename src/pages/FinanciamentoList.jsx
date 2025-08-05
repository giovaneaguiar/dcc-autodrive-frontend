import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import financiamentoService from '../services/financiamentoService';

function FinanciamentoList() {
    const [financiamentos, setFinanciamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [financiamentoToDelete, setFinanciamentoToDelete] = useState(null);

    useEffect(() => {
        const fetchFinanciamentos = async () => {
            try {
                const response = await financiamentoService.getAll();
                setFinanciamentos(response.data);
            } catch (err) {
                console.error("Erro ao buscar financiamentos:", err);
                setError("Erro ao carregar financiamentos. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchFinanciamentos();
    }, []);

    const confirmDelete = (financiamento) => {
        setFinanciamentoToDelete(financiamento);
        setModalMessage(`Tem certeza que deseja excluir o financiamento ID: ${financiamento.id}?`);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!financiamentoToDelete) return;
        try {
            await financiamentoService.delete(financiamentoToDelete.id);
            setFinanciamentos(financiamentos.filter(financiamento => financiamento.id !== financiamentoToDelete.id));
            setModalMessage("Financiamento excluído com sucesso!");
        } catch (err) {
            console.error("Erro ao excluir financiamento:", err);
            setModalMessage("Erro ao excluir financiamento.");
        } finally {
            setShowModal(false);
            setFinanciamentoToDelete(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setFinanciamentoToDelete(null);
    };

    if (loading) return <div className="loading-message">Carregando financiamentos...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (financiamentos.length === 0) return (
        <div className="no-data-message">
            <p>Nenhum financiamento encontrado.</p>
            <Link to="/financiamentos/new" className="add-button">
                Adicionar Novo Financiamento
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Financiamentos</h2>
            <Link to="/financiamentos/new" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors">
                Adicionar Novo Financiamento
            </Link>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="global-list-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Valor</th>
                            <th>Parcela</th>
                            <th>Observação</th>
                            <th>Aprovado</th>
                            <th>Venda ID</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {financiamentos.map((financiamento) => (
                            <tr key={financiamento.id}>
                                <td>{financiamento.id}</td>
                                <td>{financiamento.valor ? `R$ ${financiamento.valor.toFixed(2)}` : 'N/A'}</td>
                                <td>{financiamento.parcela || 'N/A'}</td>
                                <td>{financiamento.observacao || 'N/A'}</td>
                                <td>{financiamento.aprovado ? 'Sim' : 'Não'}</td>
                                <td>{financiamento.venda ? financiamento.venda.id : 'N/A'}</td> {/* Assumindo que Venda tem um campo 'id' */}
                                <td>
                                    <Link to={`/financiamentos/edit/${financiamento.id}`} className="action-link">
                                        Editar
                                    </Link>
                                    <button onClick={() => confirmDelete(financiamento)} className="action-button">
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

export default FinanciamentoList;
