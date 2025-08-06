import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import usuarioService from '../services/usuarioService';

function UsuarioList() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [usuarioToDelete, setUsuarioToDelete] = useState(null);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await usuarioService.getAll();
                setUsuarios(response.data);
            } catch (err) {
                console.error("Erro ao buscar usuários:", err);
                setError("Erro ao carregar usuários. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsuarios();
    }, []);

    const confirmDelete = (usuario) => {
        setUsuarioToDelete(usuario);
        setModalMessage(`Tem certeza que deseja excluir o usuário "${usuario.nome}"?`);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!usuarioToDelete) return;
        try {
            await usuarioService.delete(usuarioToDelete.id);
            setUsuarios(usuarios.filter(usuario => usuario.id !== usuarioToDelete.id));
            setModalMessage("Usuário excluído com sucesso!");
        } catch (err) {
            console.error("Erro ao excluir usuário:", err);
            setModalMessage("Erro ao excluir usuário.");
        } finally {
            setShowModal(false);
            setUsuarioToDelete(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setUsuarioToDelete(null);
    };

    if (loading) return <div className="loading-message">Carregando usuários...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (usuarios.length === 0) return (
        <div className="no-data-message">
            <p>Nenhum usuário encontrado.</p>
            <Link to="/usuarios/new" className="add-button">
                Adicionar Novo Usuário
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Usuários</h2>
            <Link to="/usuarios/new" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors">
                Adicionar Novo Usuário
            </Link>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="global-list-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Telefone</th>
                            <th>CPF</th>
                            <th>Tipo</th>
                            <th>Empresa</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.nome || 'N/A'}</td>
                                <td>{usuario.email || 'N/A'}</td>
                                <td>{usuario.telefone || 'N/A'}</td>
                                <td>{usuario.cpf || 'N/A'}</td>
                                <td>{usuario.tipo || 'N/A'}</td>
                                <td>{usuario.nomeEmpresa || 'N/A'}</td>
                                <td>
                                    <Link to={`/usuarios/edit/${usuario.id}`} className="action-link">
                                        Editar
                                    </Link>
                                    <button onClick={() => confirmDelete(usuario)} className="action-button">
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

export default UsuarioList;
