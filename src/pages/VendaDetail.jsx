import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vendaService from '../services/vendaService';
import usuarioService from '../services/usuarioService';
import veiculoService from '../services/veiculoService';

function VendaDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [venda, setVenda] = useState({
        dataVenda: '',
        valorFinal: '',
        concluido: false,
        descricao: '',
        status: '',
        usuario: null,
        veiculo: null,
    });
    const [usuarios, setUsuarios] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const statusVenda = ["PENDENTE", "EM ANDAMENTO", "CONCLUIDA", "CANCELADA"]; 

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Busca todos os usuários e veículos para preencher os dropdowns
                const [usersResponse, vehiclesResponse] = await Promise.all([
                    usuarioService.getAll(),
                    veiculoService.getAll()
                ]);
                const allUsuarios = usersResponse.data;
                const allVeiculos = vehiclesResponse.data;
                setUsuarios(allUsuarios);
                setVeiculos(allVeiculos);

                if (id) {
                    // Se for uma edição, busca os dados da venda
                    const vendaResponse = await vendaService.getById(id);
                    const vendaData = vendaResponse.data;

                    // Encontra o objeto de usuário completo a partir do idUsuario da venda
                    const userObj = allUsuarios.find(u => u.id === vendaData.idUsuario) || null;
                    // Encontra o objeto de veículo completo a partir do idVeiculo da venda
                    const vehicleObj = allVeiculos.find(v => v.id === vendaData.idVeiculo) || null;

                    setVenda({
                        ...vendaData,
                        usuario: userObj,
                        veiculo: vehicleObj,
                        dataVenda: vendaData.dataVenda ? new Date(vendaData.dataVenda).toISOString().split('T')[0] : ''
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
        const { name, value, type, checked } = e.target;
        if (name === 'usuario') {
            setVenda(prev => ({ ...prev, usuario: usuarios.find(u => u.id === parseInt(value)) || null }));
        } else if (name === 'veiculo') {
            setVenda(prev => ({ ...prev, veiculo: veiculos.find(v => v.id === parseInt(value)) || null }));
        } else {
            setVenda(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const vendaToSave = { ...venda };

            // Antes de salvar, transforma os objetos de relacionamento em IDs
            if (vendaToSave.usuario) {
                vendaToSave.usuario = { id: vendaToSave.usuario.id };
            }
            if (vendaToSave.veiculo) {
                vendaToSave.veiculo = { id: vendaToSave.veiculo.id };
            }

            if (id) {
                await vendaService.update(id, vendaToSave);
                setModalMessage("Venda atualizada com sucesso!");
            } else {
                await vendaService.create(vendaToSave);
                setModalMessage("Venda criada com sucesso!");
            }
            setShowModal(true);
            setTimeout(() => navigate('/vendas'), 2000);
        } catch (err) {
            console.error("Erro ao salvar venda:", err);
            setModalMessage("Erro ao salvar venda.");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (loading) return <div className="text-center p-4">Carregando dados da venda...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="form-container">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Venda' : 'Nova Venda'}</h2>
            <form onSubmit={handleSubmit}>
                {id && (
                    <div className="form-field">
                        <label className="form-label">ID:</label>
                        <input type="text" name="id" value={id} readOnly className="form-input" />
                    </div>
                )}
                <div className="form-field">
                    <label className="form-label">Data da Venda:</label>
                    <input type="date" name="dataVenda" value={venda.dataVenda} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Valor Final:</label>
                    <input type="number" name="valorFinal" value={venda.valorFinal} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">
                        Concluído:
                        <input type="checkbox" name="concluido" checked={venda.concluido} onChange={handleChange} className="ml-2" />
                    </label>
                </div>
                <div className="form-field">
                    <label className="form-label">Descrição:</label>
                    <textarea name="descricao" value={venda.descricao} onChange={handleChange} className="form-input"></textarea>
                </div>
                <div className="form-field">
                    <label className="form-label">Status:</label>
                    <select name="status" value={venda.status} onChange={handleChange} className="form-input">
                        <option value="">Selecione o status</option>
                        {statusVenda.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                <div className="form-field">
                    <label className="form-label">Usuário:</label>
                    <select name="usuario" value={venda.usuario ? venda.usuario.id : ''} onChange={handleChange} className="form-input">
                        <option value="">Selecione um usuário</option>
                        {usuarios.map(user => (
                            <option key={user.id} value={user.id}>{user.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label className="form-label">Veículo:</label>
                    <select name="veiculo" value={venda.veiculo ? venda.veiculo.id : ''} onChange={handleChange} className="form-input">
                        <option value="">Selecione um veículo</option>
                        {veiculos.map(vehicle => (
                            <option key={vehicle.id} value={vehicle.id}>{`${vehicle.modelo} - ${vehicle.placa}`}</option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/vendas')} className="cancel-button">
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

export default VendaDetail;
