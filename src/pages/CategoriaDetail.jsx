// src/pages/CategoriaDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import categoriaService from '../services/categoriaService';

function CategoriaDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categoria, setCategoria] = useState({
        nome: '',
        descricao: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isNew = id === 'new';

    useEffect(() => {
        if (!isNew) {
            const fetchCategoria = async () => {
                try {
                    const response = await categoriaService.getById(id);
                    setCategoria(response.data);
                } catch (err) {
                    console.error("Erro ao buscar categoria:", err);
                    setError("Erro ao carregar categoria. Tente novamente mais tarde.");
                } finally {
                    setLoading(false);
                }
            };
            fetchCategoria();
        } else {
            setLoading(false);
        }
    }, [id, isNew]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategoria(prevCategoria => ({
            ...prevCategoria,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isNew) {
                await categoriaService.create(categoria);
                alert("Categoria criada com sucesso!");
            } else {
                await categoriaService.update(id, categoria);
                alert("Categoria atualizada com sucesso!");
            }
            navigate('/categorias');
        } catch (err) {
            console.error("Erro ao salvar categoria:", err);
            alert("Erro ao salvar categoria.");
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>{isNew ? 'Criar Nova Categoria' : `Editar Categoria`}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="descricao">Descrição:</label>
                    <textarea id="descricao" name="descricao" value={categoria.descricao} onChange={handleChange} />
                </div>
            
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => navigate('/categorias')}>Cancelar</button>
            </form>
        </div>
    );
}

export default CategoriaDetail;