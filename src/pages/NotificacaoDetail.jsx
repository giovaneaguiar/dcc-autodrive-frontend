import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import notificacaoService from '../services/notificacaoService';
import usuarioService from '../services/usuarioService';

function NotificacaoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [notificacao, setNotificacao] = useState({
        titulo: '',
        descricao: '',
        valor: '',
        dataCriacao: '',
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
                setUsuarios(usersResponse.data);

                if (id) {
                    const notificacaoResponse = await notificacaoService.getById(id);
                    setNotificacao({
                        ...notificacaoResponse.data,
                        dataCriacao: notificacaoResponse.data.dataCriacao ? new Date(notificacaoResponse.data.dataCriacao).toISOString().split('T')[0] : ''
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
            setNotificacao(prev => ({ ...prev, usuario: usuarios.find(u => u.id === parseInt(value)) || null }));
        } else {
            setNotificacao(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await notificacaoService.update(id, notificacao);
                setModalMessage("Notificação atualizada com sucesso!");
            } else {
                await notificacaoService.create(notificacao);
                setModalMessage("Notificação criada com sucesso!");
            }
            setShowModal(true);
            setTimeout(() => navigate('/notificacoes'), 2000);
        } catch (err) {
            console.error("Erro ao salvar notificação:", err);
            setModalMessage("Erro ao salvar notificação.");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (loading) return <div className="text-center p-4">Carregando dados da notificação...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="form-container">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Notificação' : 'Nova Notificação'}</h2>
            <form onSubmit={handleSubmit}>
                {id && (
                    <div className="form-field">
                        <label className="form-label">ID:</label>
                        <input type="text" name="id" value={id} readOnly className="form-input" />
                    </div>
                )}
                <div className="form-field">
                    <label className="form-label">Título:</label>
                    <input type="text" name="titulo" value={notificacao.titulo} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Descrição:</label>
                    <textarea name="descricao" value={notificacao.descricao} onChange={handleChange} className="form-input"></textarea>
                </div>
                <div className="form-field">
                    <label className="form-label">Valor:</label>
                    <input type="number" name="valor" value={notificacao.valor} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Data Criação:</label>
                    <input type="date" name="dataCriacao" value={notificacao.dataCriacao} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Usuário:</label>
                    <select name="usuario" value={notificacao.usuario ? notificacao.usuario.id : ''} onChange={handleChange} className="form-input">
                        <option value="">Selecione um usuário</option>
                        {usuarios.map(user => (
                            <option key={user.id} value={user.id}>{user.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/notificacoes')} className="cancel-button">
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

export default NotificacaoDetail;
