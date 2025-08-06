import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import veiculoService from '../services/veiculoService';

function VeiculoList() {
    const [veiculos, setVeiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [veiculoToDelete, setVeiculoToDelete] = useState(null);

    useEffect(() => {
        const fetchVeiculos = async () => {
            try {
                const response = await veiculoService.getAll();
                setVeiculos(response.data);
            } catch (err) {
                console.error("Erro ao buscar veículos:", err);
                setError("Erro ao carregar veículos. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchVeiculos();
    }, []);

    const confirmDelete = (veiculo) => {
        setVeiculoToDelete(veiculo);
        setModalMessage(`Tem certeza que deseja excluir o veículo "${veiculo.modelo} - ${veiculo.placa}"?`);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!veiculoToDelete) return;
        try {
            await veiculoService.delete(veiculoToDelete.id);
            setVeiculos(veiculos.filter(veiculo => veiculo.id !== veiculoToDelete.id));
            setModalMessage("Veículo excluído com sucesso!");
        } catch (err) {
            console.error("Erro ao excluir veículo:", err);
            setModalMessage("Erro ao excluir veículo.");
        } finally {
            setShowModal(false);
            setVeiculoToDelete(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setVeiculoToDelete(null);
    };

    if (loading) return <div className="loading-message">Carregando veículos...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (veiculos.length === 0) return (
        <div className="no-data-message">
            <p>Nenhum veículo encontrado.</p>
            <Link to="/veiculos/new" className="add-button">
                Adicionar Novo Veículo
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Veículos</h2>
            <Link to="/veiculos/new" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors">
                Adicionar Novo Veículo
            </Link>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="global-list-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Placa</th>
                            <th>Modelo</th>
                            <th>Cor</th>
                            <th>Ano</th>
                            <th>Preço</th>
                            <th>Ativo</th>
                            <th>Condição</th>
                            <th>Empresa</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {veiculos.map((veiculo) => (
                            <tr key={veiculo.id}>
                                <td>{veiculo.id}</td>
                                <td>{veiculo.placa || 'N/A'}</td>
                                <td>{veiculo.modelo || 'N/A'}</td>
                                <td>{veiculo.cor || 'N/A'}</td>
                                <td>{veiculo.ano || 'N/A'}</td>
                                <td>{veiculo.preco ? `R$ ${veiculo.preco.toFixed(2)}` : 'N/A'}</td>
                                <td>{veiculo.ativo ? 'Sim' : 'Não'}</td>
                                <td>{veiculo.condicao || 'N/A'}</td>
                                <td>{veiculo.empresa ? veiculo.empresa.nome : 'N/A'}</td> {/* Assumindo que Empresa tem um campo 'nome' */}
                                <td>
                                    <Link to={`/veiculos/edit/${veiculo.id}`} className="action-link">
                                        Editar
                                    </Link>
                                    <button onClick={() => confirmDelete(veiculo)} className="action-button">
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

export default VeiculoList;
