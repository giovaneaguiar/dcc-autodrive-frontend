// src/pages/CategoriaList.jsx
import React, { useEffect, useState } from 'react';
import categoriaService from '../services/categoriaService';
import { Link } from 'react-router-dom';

function CategoriaList() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await categoriaService.getAll();
                setCategorias(response.data);
            } catch (err) {
                console.error("Erro ao buscar categorias:", err);
                setError("Erro ao carregar categorias. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchCategorias();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
            try {
                await categoriaService.delete(id);
                setCategorias(categorias.filter(categoria => categoria.id !== id));
                alert("Categoria excluída com sucesso!");
            } catch (err) {
                console.error("Erro ao excluir categoria:", err);
                alert("Erro ao excluir categoria.");
            }
        }
    };

    if (loading) return <div>Carregando categorias...</div>;
    if (error) return <div>{error}</div>;
    if (categorias.length === 0) return <div>Nenhuma categoria encontrada.</div>;

    return (
        <div>
            <h2>Lista de Categorias</h2>
            <Link to="/categorias/new">Adicionar Nova Categoria</Link>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((categoria) => (
                        <tr key={categoria.id}>
                            <td>{categoria.id}</td>
                            <td>{categoria.descricao || 'N/A'}</td>
                            <td>
                                <Link to={`/categorias/edit/${categoria.id}`}>Editar</Link>
                                <button onClick={() => handleDelete(categoria.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CategoriaList;