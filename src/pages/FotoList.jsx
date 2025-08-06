import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import fotoService from '../services/fotoService';

function FotoList() {
    const [fotos, setFotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [fotoToDelete, setFotoToDelete] = useState(null);

    useEffect(() => {
        const fetchFotos = async () => {
            try {
                const response = await fotoService.getAll();
                setFotos(response.data);
            } catch (err) {
                console.error("Erro ao buscar fotos:", err);
                setError("Erro ao carregar fotos. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchFotos();
    }, []);

    const confirmDelete = (foto) => {
        setFotoToDelete(foto);
        setModalMessage(`Tem certeza que deseja excluir a foto ID: ${foto.id}?`);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!fotoToDelete) return;
        try {
            await fotoService.delete(fotoToDelete.id);
            setFotos(fotos.filter(foto => foto.id !== fotoToDelete.id));
            setModalMessage("Foto excluída com sucesso!");
        } catch (err) {
            console.error("Erro ao excluir foto:", err);
            setModalMessage("Erro ao excluir foto.");
        } finally {
            setShowModal(false);
            setFotoToDelete(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setFotoToDelete(null);
    };

    if (loading) return <div className="loading-message">Carregando fotos...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (fotos.length === 0) return (
        <div className="no-data-message">
            <p>Nenhuma foto encontrada.</p>
            <Link to="/fotos/new" className="add-button">
                Adicionar Nova Foto
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Fotos</h2>
            <Link to="/fotos/new" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors">
                Adicionar Nova Foto
            </Link>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="global-list-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Foto (URL)</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fotos.map((foto) => (
                            <tr key={foto.id}>
                                <td>{foto.id}</td>
                                <td>
                                    {foto.foto ? (
                                        <a href={foto.foto} target="_blank" rel="noopener noreferrer">Ver Foto</a>
                                    ) : 'N/A'}
                                </td>
                                <td>
                                    <Link to={`/fotos/edit/${foto.id}`} className="action-link">
                                        Editar
                                    </Link>
                                    <button onClick={() => confirmDelete(foto)} className="action-button">
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

export default FotoList;
