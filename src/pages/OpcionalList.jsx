import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import opcionalService from '../services/opcionalService';

function OpcionalList() {
    const [opcionais, setOpcionais] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [opcionalToDelete, setOpcionalToDelete] = useState(null);

    useEffect(() => {
        const fetchOpcionais = async () => {
            try {
                const response = await opcionalService.getAll();
                setOpcionais(response.data);
            } catch (err) {
                console.error("Erro ao buscar opcionais:", err);
                setError("Erro ao carregar opcionais. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchOpcionais();
    }, []);

    const confirmDelete = (opcional) => {
        setOpcionalToDelete(opcional);
        setModalMessage(`Tem certeza que deseja excluir o opcional "${opcional.descricao}"?`);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!opcionalToDelete) return;
        try {
            await opcionalService.delete(opcionalToDelete.id);
            setOpcionais(opcionais.filter(opcional => opcional.id !== opcionalToDelete.id));
            setModalMessage("Opcional excluído com sucesso!");
        } catch (err) {
            console.error("Erro ao excluir opcional:", err);
            setModalMessage("Erro ao excluir opcional.");
        } finally {
            setShowModal(false);
            setOpcionalToDelete(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setOpcionalToDelete(null);
    };

    if (loading) return <div className="loading-message">Carregando opcionais...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (opcionais.length === 0) return (
        <div className="no-data-message">
            <p>Nenhum opcional encontrado.</p>
            <Link to="/opcionais/new" className="add-button">
                Adicionar Novo Opcional
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Opcionais</h2>
            <Link to="/opcionais/new" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors">
                Adicionar Novo Opcional
            </Link>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="global-list-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Descrição</th>
                            <th>Ar Cond.</th>
                            <th>Dir. Hid.</th>
                            <th>Vidro El.</th>
                            <th>Câmera Ré</th>
                            <th>Sensor</th>
                            <th>Completo</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {opcionais.map((opcional) => (
                            <tr key={opcional.id}>
                                <td>{opcional.id}</td>
                                <td>{opcional.descricao || 'N/A'}</td>
                                <td>{opcional.arCondicionado ? 'Sim' : 'Não'}</td>
                                <td>{opcional.direcaoHidraulica ? 'Sim' : 'Não'}</td>
                                <td>{opcional.vidroEletrico ? 'Sim' : 'Não'}</td>
                                <td>{opcional.cameraRe ? 'Sim' : 'Não'}</td>
                                <td>{opcional.sensor ? 'Sim' : 'Não'}</td>
                                <td>{opcional.completo ? 'Sim' : 'Não'}</td>
                                <td>
                                    <Link to={`/opcionais/edit/${opcional.id}`} className="action-link">
                                        Editar
                                    </Link>
                                    <button onClick={() => confirmDelete(opcional)} className="action-button">
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

export default OpcionalList;
