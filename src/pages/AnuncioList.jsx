import React, { useEffect, useState } from 'react';
import anuncioService from '../services/anuncioService';
import { Link } from 'react-router-dom';

function AnuncioList() {
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnuncios = async () => {
            try {
                const response = await anuncioService.getAll();
                setAnuncios(response.data);
            } catch (err) {
                console.error("Erro ao buscar anúncios:", err);
                setError("Erro ao carregar anúncios. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchAnuncios();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir este anúncio?")) {
            try {
                await anuncioService.delete(id);
                setAnuncios(anuncios.filter(anuncio => anuncio.id !== id));
                alert("Anúncio excluído com sucesso!");
            } catch (err) {
                console.error("Erro ao excluir anúncio:", err);
                alert("Erro ao excluir anúncio.");
            }
        }
    };

    if (loading) return <div>Carregando anúncios...</div>;
    if (error) return <div>{error}</div>;
    if (anuncios.length === 0) return <div>Nenhum anúncio encontrado.</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lista de Anúncios</h2>
            <Link to="/anuncios/new" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 transition-colors">
                Adicionar Novo Anúncio
            </Link>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="global-list-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Data Anúncio</th>
                            <th>Preço</th>
                            <th>Descrição</th>
                            <th>Foto (URL)</th>
                            <th>Vendido</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {anuncios.map((anuncio) => (
                            <tr key={anuncio.id}>
                                <td>{anuncio.id}</td>
                                <td>{anuncio.dataAnuncio ? new Date(anuncio.dataAnuncio).toLocaleDateString() : 'N/A'}</td>
                                <td>{anuncio.preco ? `R$ ${anuncio.preco.toFixed(2)}` : 'N/A'}</td>
                                <td>{anuncio.descricao || 'N/A'}</td>
                                <td>
                                    {anuncio.foto ? (
                                        <a href={anuncio.foto} target="_blank" rel="noopener noreferrer">Ver Foto</a>
                                    ) : 'N/A'}
                                </td>
                                <td>{anuncio.vendido ? 'Sim' : 'Não'}</td>
                                <td>
                                    <Link to={`/anuncios/edit/${anuncio.id}`} className="action-link">
                                        Editar
                                    </Link>
                                    <button onClick={() => handleDelete(anuncio.id)} className="action-button">
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AnuncioList;
