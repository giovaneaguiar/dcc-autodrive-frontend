import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import empresaService from '../services/empresaService';

function EmpresaList() {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [empresaToDelete, setEmpresaToDelete] = useState(null);

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const response = await empresaService.getAll();
                setEmpresas(response.data);
            } catch (err) {
                console.error("Erro ao buscar empresas:", err);
                setError("Erro ao carregar empresas. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchEmpresas();
    }, []);

    const confirmDelete = (empresa) => {
        setEmpresaToDelete(empresa);
        setModalMessage(`Tem certeza que deseja excluir a empresa "${empresa.nome}"?`);
        setShowModal(true);
    };

    const handleDelete = async () => {
        if (!empresaToDelete) return;
        try {
            await empresaService.delete(empresaToDelete.id);
            setEmpresas(empresas.filter(empresa => empresa.id !== empresaToDelete.id));
            setModalMessage("Empresa excluída com sucesso!");
        } catch (err) {
            console.error("Erro ao excluir empresa:", err);
            setModalMessage("Erro ao excluir empresa.");
        } finally {
            setShowModal(false);
            setEmpresaToDelete(null);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setEmpresaToDelete(null);
    };

    if (loading) return <div className="loading-message">Carregando empresas...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (empresas.length === 0) return (
        <div className="no-data-message">
            <p>Nenhuma empresa encontrada.</p>
            <Link to="/empresas/new" className="add-button">
                Adicionar Nova Empresa
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Empresas</h2>
            <Link to="/empresas/new" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors">
                Adicionar Nova Empresa
            </Link>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="global-list-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>CNPJ</th>
                            <th>Endereço</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {empresas.map((empresa) => (
                            <tr key={empresa.id}>
                                <td>{empresa.id}</td>
                                <td>{empresa.nome || 'N/A'}</td>
                                <td>{empresa.cnpj || 'N/A'}</td>
                                <td>{`${empresa.logradouro || ''}, ${empresa.numero || ''} - ${empresa.cidade || ''}/${empresa.uf || ''}`}</td>
                                <td>
                                    <Link to={`/empresas/edit/${empresa.id}`} className="action-link">
                                        Editar
                                    </Link>
                                    <button onClick={() => confirmDelete(empresa)} className="action-button">
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
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
                        <h3 className="text-lg font-bold">{modalMessage}</h3>
                        <div className="mt-4 flex justify-end gap-2">
                            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                                Confirmar
                            </button>
                            <button onClick={handleCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmpresaList;
