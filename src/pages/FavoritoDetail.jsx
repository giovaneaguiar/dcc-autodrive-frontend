import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import favoritoService from '../services/favoritoService';
import usuarioService from '../services/usuarioService';
import veiculoService from '../services/veiculoService'; 

function FavoritoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [favorito, setFavorito] = useState({
        dataFavorito: '',
        descricao: '',
        usuario: null,
        veiculo: null,
    });
    const [usuarios, setUsuarios] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Busca usuários e veículos para os dropdowns
                const [usersResponse, vehiclesResponse] = await Promise.all([
                    usuarioService.getAll(),
                    veiculoService.getAll()
                ]);
                setUsuarios(usersResponse.data);
                setVeiculos(vehiclesResponse.data);

                if (id) {
                    const favoritoResponse = await favoritoService.getById(id);
                    setFavorito({
                        ...favoritoResponse.data,
                        dataFavorito: favoritoResponse.data.dataFavorito ? new Date(favoritoResponse.data.dataFavorito).toISOString().split('T')[0] : ''
                    });
                }
            } catch (err) {
                console.error("Erro ao buscar dados:", err);
                setError("Erro ao carregar dados. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'usuario') {
            setFavorito(prev => ({ ...prev, usuario: usuarios.find(u => u.id === parseInt(value)) || null }));
        } else if (name === 'veiculo') {
            setFavorito(prev => ({ ...prev, veiculo: veiculos.find(v => v.id === parseInt(value)) || null }));
        } else {
            setFavorito(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await favoritoService.update(id, favorito);
                setModalMessage("Favorito atualizado com sucesso!");
            } else {
                await favoritoService.create(favorito);
                setModalMessage("Favorito criado com sucesso!");
            }
            setShowModal(true);
            setTimeout(() => navigate('/favoritos'), 2000);
        } catch (err) {
            console.error("Erro ao salvar favorito:", err);
            setModalMessage("Erro ao salvar favorito.");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (loading) return <div className="text-center p-4">Carregando dados do favorito...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="form-container">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Favorito' : 'Novo Favorito'}</h2>
            <form onSubmit={handleSubmit}>
                {id && (
                    <div className="form-field">
                        <label className="form-label">ID:</label>
                        <input type="text" name="id" value={id} readOnly className="form-input" />
                    </div>
                )}
                <div className="form-field">
                    <label className="form-label">Data do Favorito:</label>
                    <input type="date" name="dataFavorito" value={favorito.dataFavorito} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Descrição:</label>
                    <textarea name="descricao" value={favorito.descricao} onChange={handleChange} className="form-input"></textarea>
                </div>
                <div className="form-field">
                    <label className="form-label">Usuário:</label>
                    <select name="usuario" value={favorito.usuario ? favorito.usuario.id : ''} onChange={handleChange} className="form-input">
                        <option value="">Selecione um usuário</option>
                        {usuarios.map(user => (
                            <option key={user.id} value={user.id}>{user.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label className="form-label">Veículo:</label>
                    <select name="veiculo" value={favorito.veiculo ? favorito.veiculo.id : ''} onChange={handleChange} className="form-input">
                        <option value="">Selecione um veículo</option>
                        {veiculos.map(vehicle => (
                            <option key={vehicle.id} value={vehicle.id}>{vehicle.modelo}</option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/favoritos')} className="cancel-button">
                        Voltar
                    </button>
                    <button type="submit" className="submit-button">
                        Salvar
                    </button>
                </div>
            </form>

            {showModal && (
                <div className="custom-modal-backdrop">
                    <div className="custom-modal-content">
                        <h3 className="text-lg font-bold">{modalMessage}</h3>
                        <div className="custom-modal-actions">
                            <button onClick={handleCloseModal} className="submit-button">
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FavoritoDetail;
