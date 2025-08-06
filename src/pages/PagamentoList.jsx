import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import pagamentoService from '../services/pagamentoService';

function PagamentoList() {
    const [pagamentos, setPagamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [pagamentoToDelete, setPagamentoToDelete] = useState(null);

    useEffect(() => {
        const fetchPagamentos = async () => {
            try {
                const response = await pagamentoService.getAll();
                setPagamentos(response.data);
            } catch (err) {
                console.error("Erro ao buscar pagamentos:", err);
                setError("Erro ao carregar pagamentos. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchPagamentos();
    }, []);

    const confirmDelete = (pagamento) => {
        setPagamentoToDelete(pagamento);
        setModalMessage(`Tem certeza que deseja excluir o pagamento ID: ${pagamento.id}?`);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!pagamentoToDelete) return;
        try {
            await pagamentoService.delete(pagamentoToDelete.id);
            setPagamentos(pagamentos.filter(pagamento => pagamento.id !== pagamentoToDelete.id));
            setModalMessage("Pagamento excluído com sucesso!");
        } catch (err) {
            console.error("Erro ao excluir pagamento:", err);
            setModalMessage("Erro ao excluir pagamento.");
        } finally {
            setShowModal(false);
            setPagamentoToDelete(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setPagamentoToDelete(null);
    };

    if (loading) return <div className="loading-message">Carregando pagamentos...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (pagamentos.length === 0) return (
        <div className="no-data-message">
            <p>Nenhum pagamento encontrado.</p>
            <Link to="/pagamentos/new" className="add-button">
                Adicionar Novo Pagamento
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Pagamentos</h2>
            <Link to="/pagamentos/new" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors">
                Adicionar Novo Pagamento
            </Link>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="global-list-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Status</th>
                            <th>Método</th>
                            <th>Data Pagamento</th>
                            <th>Descrição</th>
                            <th>Venda ID</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagamentos.map((pagamento) => (
                            <tr key={pagamento.id}>
                                <td>{pagamento.id}</td>
                                <td>{pagamento.status || 'N/A'}</td>
                                <td>{pagamento.metodo || 'N/A'}</td>
                                <td>{pagamento.dataPagamento ? new Date(pagamento.dataPagamento).toLocaleDateString() : 'N/A'}</td>
                                <td>{pagamento.descricao || 'N/A'}</td>
                                <td>{pagamento.idVenda || 'N/A'}</td>
                                <td>
                                    <Link to={`/pagamentos/edit/${pagamento.id}`} className="action-link">
                                        Editar
                                    </Link>
                                    <button onClick={() => confirmDelete(pagamento)} className="action-button">
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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

export default PagamentoList;
