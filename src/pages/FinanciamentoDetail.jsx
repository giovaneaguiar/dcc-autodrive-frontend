import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import financiamentoService from '../services/financiamentoService';
import vendaService from '../services/vendaService';

function FinanciamentoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [financiamento, setFinanciamento] = useState({
        valor: '',
        parcela: '',
        observacao: '',
        aprovado: false,
        venda: null,
    });
    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Busca vendas para o dropdown
                const salesResponse = await vendaService.getAll();
                setVendas(salesResponse.data);

                if (id) {
                    const financiamentoResponse = await financiamentoService.getById(id);
                    setFinanciamento(financiamentoResponse.data);
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
        if (name === 'venda') {
            setFinanciamento(prev => ({ ...prev, venda: vendas.find(v => v.id === parseInt(value)) || null }));
        } else {
            setFinanciamento(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await financiamentoService.update(id, financiamento);
                setModalMessage("Financiamento atualizado com sucesso!");
            } else {
                await financiamentoService.create(financiamento);
                setModalMessage("Financiamento criado com sucesso!");
            }
            setShowModal(true);
            setTimeout(() => navigate('/financiamentos'), 2000);
        } catch (err) {
            console.error("Erro ao salvar financiamento:", err);
            setModalMessage("Erro ao salvar financiamento.");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (loading) return <div className="text-center p-4">Carregando dados do financiamento...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="form-container">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Financiamento' : 'Novo Financiamento'}</h2>
            <form onSubmit={handleSubmit}>
                {id && (
                    <div className="form-field">
                        <label className="form-label">ID:</label>
                        <input type="text" name="id" value={id} readOnly className="form-input" />
                    </div>
                )}
                <div className="form-field">
                    <label className="form-label">Valor:</label>
                    <input type="number" name="valor" value={financiamento.valor} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Parcela:</label>
                    <input type="number" name="parcela" value={financiamento.parcela} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Observação:</label>
                    <textarea name="observacao" value={financiamento.observacao} onChange={handleChange} className="form-input"></textarea>
                </div>
                <div className="form-field">
                    <label className="form-label">
                        Aprovado:
                        <input type="checkbox" name="aprovado" checked={financiamento.aprovado} onChange={handleChange} className="ml-2" />
                    </label>
                </div>
                <div className="form-field">
                    <label className="form-label">Venda:</label>
                    <select name="venda" value={financiamento.venda ? financiamento.venda.id : ''} onChange={handleChange} className="form-input">
                        <option value="">Selecione uma venda</option>
                        {vendas.map(sale => (
                            <option key={sale.id} value={sale.id}>
                                {`${'Veículo: ' + sale.nomeVeiculo || 'Veículo Desconhecido'} - ${'Usuário: ' + sale.nomeUsuario || 'Usuário Desconhecido'}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/financiamentos')} className="cancel-button">
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

export default FinanciamentoDetail;
