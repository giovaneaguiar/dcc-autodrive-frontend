import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usuarioService from '../services/usuarioService';
import empresaService from '../services/empresaService';

function UsuarioDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState({
        nome: '',
        email: '',
        senha: '',
        telefone: '',
        cpf: '',
        tipo: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
        cep: '',
        empresa: null,
    });
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const tiposUsuario = ["ADMIN", "CLIENTE", "VENDEDOR"];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Busca todas as empresas para preencher o dropdown
                const empresasResponse = await empresaService.getAll();
                const allEmpresas = empresasResponse.data;
                setEmpresas(allEmpresas);

                if (id) {
                    const usuarioResponse = await usuarioService.getById(id);
                    const usuarioData = usuarioResponse.data;

                    const empresaObj = allEmpresas.find(emp => emp.id === usuarioData.idEmpresa) || null;

                    setUsuario({
                        ...usuarioData,
                        empresa: empresaObj,
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
        if (name === 'empresa') {
            setUsuario(prev => ({ ...prev, empresa: empresas.find(emp => emp.id === parseInt(value)) || null }));
        } else {
            setUsuario(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const usuarioToSave = { ...usuario };

            if (usuarioToSave.empresa) {
                usuarioToSave.empresa = { id: usuarioToSave.empresa.id };
            }

            if (id) {
                await usuarioService.update(id, usuarioToSave);
                setModalMessage("Usuário atualizado com sucesso!");
            } else {
                await usuarioService.create(usuarioToSave);
                setModalMessage("Usuário criado com sucesso!");
            }
            setShowModal(true);
            setTimeout(() => navigate('/usuarios'), 2000);
        } catch (err) {
            console.error("Erro ao salvar usuário:", err);
            setModalMessage("Erro ao salvar usuário.");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (loading) return <div className="text-center p-4">Carregando dados do usuário...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="form-container">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Usuário' : 'Novo Usuário'}</h2>
            <form onSubmit={handleSubmit}>
                {id && (
                    <div className="form-field">
                        <label className="form-label">ID:</label>
                        <input type="text" name="id" value={id} readOnly className="form-input" />
                    </div>
                )}
                <div className="form-field">
                    <label className="form-label">Nome:</label>
                    <input type="text" name="nome" value={usuario.nome} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Email:</label>
                    <input type="email" name="email" value={usuario.email} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Senha:</label>
                    <input type="password" name="senha" value={usuario.senha} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Telefone:</label>
                    <input type="text" name="telefone" value={usuario.telefone} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">CPF:</label>
                    <input type="text" name="cpf" value={usuario.cpf} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Tipo:</label>
                    <select name="tipo" value={usuario.tipo} onChange={handleChange} className="form-input">
                        <option value="">Selecione o tipo</option>
                        {tiposUsuario.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label className="form-label">Logradouro:</label>
                    <input type="text" name="logradouro" value={usuario.logradouro} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Número:</label>
                    <input type="number" name="numero" value={usuario.numero} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Complemento:</label>
                    <input type="text" name="complemento" value={usuario.complemento} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Bairro:</label>
                    <input type="text" name="bairro" value={usuario.bairro} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Cidade:</label>
                    <input type="text" name="cidade" value={usuario.cidade} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">UF:</label>
                    <input type="text" name="uf" value={usuario.uf} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">CEP:</label>
                    <input type="text" name="cep" value={usuario.cep} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Empresa:</label>
                    <select name="empresa" value={usuario.empresa ? usuario.empresa.id : ''} onChange={handleChange} className="form-input">
                        <option value="">Selecione uma empresa</option>
                        {empresas.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/usuarios')} className="cancel-button">
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

export default UsuarioDetail;
