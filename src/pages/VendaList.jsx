import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import vendaService from '../services/vendaService';

function VendaList() {
    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [vendaToDelete, setVendaToDelete] = useState(null);

    useEffect(() => {
        const fetchVendas = async () => {
            try {
                const response = await vendaService.getAll();
                setVendas(response.data);
            } catch (err) {
                console.error("Erro ao buscar vendas:", err);
                setError("Erro ao carregar vendas. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchVendas();
    }, []);

    const confirmDelete = (venda) => {
        setVendaToDelete(venda);
        setModalMessage(`Tem certeza que deseja excluir a venda ID: ${venda.id}?`);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!vendaToDelete) return;
        try {
            await vendaService.delete(vendaToDelete.id);
            setVendas(vendas.filter(venda => venda.id !== vendaToDelete.id));
            setModalMessage("Venda excluída com sucesso!");
        } catch (err) {
            console.error("Erro ao excluir venda:", err);
            setModalMessage("Erro ao excluir venda.");
        } finally {
            setShowModal(false);
            setVendaToDelete(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setVendaToDelete(null);
    };

    if (loading) return <div className="loading-message">Carregando vendas...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (vendas.length === 0) return (
        <div className="no-data-message">
            <p>Nenhuma venda encontrada.</p>
            <Link to="/vendas/new" className="add-button">
                Adicionar Nova Venda
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Vendas</h2>
            <Link to="/vendas/new" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors">
                Adicionar Nova Venda
            </Link>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="global-list-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Data Venda</th>
                            <th>Valor Final</th>
                            <th>Concluído</th>
                            <th>Descrição</th>
                            <th>Status</th>
                            <th>Usuário</th>
                            <th>Veículo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendas.map((venda) => (
                            <tr key={venda.id}>
                                <td>{venda.id}</td>
                                <td>{venda.dataVenda ? new Date(venda.dataVenda).toLocaleDateString() : 'N/A'}</td>
                                <td>{venda.valorFinal ? `R$ ${venda.valorFinal.toFixed(2)}` : 'N/A'}</td>
                                <td>{venda.concluido ? 'Sim' : 'Não'}</td>
                                <td>{venda.descricao || 'N/A'}</td>
                                <td>{venda.status || 'N/A'}</td>
                                <td>{venda.usuario ? venda.usuario.nome : 'N/A'}</td> {/* Assumindo que Usuario tem um campo 'nome' */}
                                <td>{venda.veiculo ? venda.veiculo.modelo : 'N/A'}</td> {/* Assumindo que Veiculo tem um campo 'modelo' */}
                                <td>
                                    <Link to={`/vendas/edit/${venda.id}`} className="action-link">
                                        Editar
                                    </Link>
                                    <button onClick={() => confirmDelete(venda)} className="action-button">
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

export default VendaList;
