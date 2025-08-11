import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import propostaService from '../services/propostaService';
import usuarioService from '../services/usuarioService';

function PropostaDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [proposta, setProposta] = useState({
        descricao: '',
        valor: '',
        usuario: null,
    });
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const usersResponse = await usuarioService.getAll();
                const allUsuarios = usersResponse.data;
                setUsuarios(allUsuarios);

                if (id) {
                    // Se for uma edição, busca os dados da proposta
                    const propostaResponse = await propostaService.getById(id);
                    const propostaData = propostaResponse.data;

                    // Encontra o objeto de usuário completo a partir do idUsuario retornado pela API
                    const userObj = allUsuarios.find(u => u.id === propostaData.idUsuario) || null;

                    setProposta({
                        ...propostaData,
                        usuario: userObj,
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
            setProposta(prev => ({ ...prev, usuario: usuarios.find(u => u.id === parseInt(value)) || null }));
        } else {
            setProposta(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const propostaToSave = { ...proposta };

            if (propostaToSave.usuario) {
                propostaToSave.usuario = { id: propostaToSave.usuario.id };
            }

            if (id) {
                await propostaService.update(id, propostaToSave);
                setModalMessage("Proposta atualizada com sucesso!");
            } else {
                await propostaService.create(propostaToSave);
                setModalMessage("Proposta criada com sucesso!");
            }
            setShowModal(true);
            setTimeout(() => navigate('/propostas'), 2000);
        } catch (err) {
            console.error("Erro ao salvar proposta:", err);
            setModalMessage("Erro ao salvar proposta.");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (loading) return <div className="text-center p-4">Carregando dados da proposta...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="form-container">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Proposta' : 'Nova Proposta'}</h2>
            <form onSubmit={handleSubmit}>
                {id && (
                    <div className="form-field">
                        <label className="form-label">ID:</label>
                        <input type="text" name="id" value={id} readOnly className="form-input" />
                    </div>
                )}
                <div className="form-field">
                    <label className="form-label">Descrição:</label>
                    <textarea name="descricao" value={proposta.descricao} onChange={handleChange} className="form-input"></textarea>
                </div>
                <div className="form-field">
                    <label className="form-label">Valor:</label>
                    <input type="number" name="valor" value={proposta.valor} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Usuário:</label>
                    <select name="usuario" value={proposta.usuario ? proposta.usuario.id : ''} onChange={handleChange} className="form-input">
                        <option value="">Selecione um usuário</option>
                        {usuarios.map(user => (
                            <option key={user.id} value={user.id}>{user.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/propostas')} className="cancel-button">
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

export default PropostaDetail;
