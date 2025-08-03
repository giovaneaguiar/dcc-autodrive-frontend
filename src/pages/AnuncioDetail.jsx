// src/pages/AnuncioDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import anuncioService from '../services/anuncioService';

function AnuncioDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [anuncio, setAnuncio] = useState({
        dataAnuncio: '',
        preco: 0,
        descricao: '',
        foto: '',
        vendido: false,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isNew = id === 'new';

    useEffect(() => {
        if (!isNew) {
            const fetchAnuncio = async () => {
                try {
                    const response = await anuncioService.getById(id);
                    
                    setAnuncio({
                        ...response.data,
                        dataAnuncio: response.data.dataAnuncio ? new Date(response.data.dataAnuncio).toISOString().split('T')[0] : '',
                    });
                } catch (err) {
                    console.error("Erro ao buscar anúncio:", err);
                    setError("Erro ao carregar anúncio. Tente novamente mais tarde.");
                } finally {
                    setLoading(false);
                }
            };
            fetchAnuncio();
        } else {
            
            setAnuncio(prev => ({
                ...prev,
                dataAnuncio: new Date().toISOString().split('T')[0]
            }));
            setLoading(false);
        }
    }, [id, isNew]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAnuncio(prevAnuncio => ({
            ...prevAnuncio,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Opcional: Converter o preço para número antes de enviar
        const anuncioToSave = {
            ...anuncio,
            preco: parseFloat(anuncio.preco),
            // O backend espera um objeto Date para dataAnuncio. Se você está enviando 'YYYY-MM-DD',
            // o Spring Boot deve ser capaz de converter automaticamente.
            // Caso contrário, você pode precisar converter para um objeto Date aqui:
            // dataAnuncio: new Date(anuncio.dataAnuncio)
        };

        try {
            if (isNew) {
                await anuncioService.create(anuncioToSave);
                alert("Anúncio criado com sucesso!");
            } else {
                await anuncioService.update(id, anuncioToSave);
                alert("Anúncio atualizado com sucesso!");
            }
            navigate('/anuncios');
        } catch (err) {
            console.error("Erro ao salvar anúncio:", err);
            if (err.response) {
                console.error("Dados do erro de resposta:", err.response.data);
                console.error("Status do erro:", err.response.status);
                alert(`Erro ao salvar anúncio: ${err.response.data.message || err.message}`);
            } else {
                alert("Erro ao salvar anúncio. Verifique o console para mais detalhes.");
            }
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>{isNew ? 'Criar Novo Anúncio' : `Editar Anúncio`}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="dataAnuncio">Data do Anúncio:</label>
                    <input
                        type="date"
                        id="dataAnuncio"
                        name="dataAnuncio"
                        value={anuncio.dataAnuncio}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="preco">Preço:</label>
                    <input
                        type="number"
                        id="preco"
                        name="preco"
                        value={anuncio.preco}
                        onChange={handleChange}
                        step="0.01" // Permite valores decimais
                        required
                    />
                </div>
                <div>
                    <label htmlFor="descricao">Descrição:</label>
                    <textarea
                        id="descricao"
                        name="descricao"
                        value={anuncio.descricao}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="foto">URL da Foto:</label>
                    <input
                        type="text"
                        id="foto"
                        name="foto"
                        value={anuncio.foto}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="vendido">Vendido:</label>
                    <input
                        type="checkbox"
                        id="vendido"
                        name="vendido"
                        checked={anuncio.vendido}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => navigate('/anuncios')}>Cancelar</button>
            </form>
        </div>
    );
}

export default AnuncioDetail;