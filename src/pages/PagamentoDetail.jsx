import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pagamentoService from '../services/pagamentoService';
import vendaService from '../services/vendaService';

function PagamentoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pagamento, setPagamento] = useState({
        status: '',
        metodo: '',
        dataPagamento: '',
        descricao: '',
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
                const salesResponse = await vendaService.getAll();
                setVendas(salesResponse.data);

                if (id) {
                    const pagamentoResponse = await pagamentoService.getById(id);
                    setPagamento({
                        ...pagamentoResponse.data,
                        dataPagamento: pagamentoResponse.data.dataPagamento ? new Date(pagamentoResponse.data.dataPagamento).toISOString().split('T')[0] : ''
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
        if (name === 'venda') {
            setPagamento(prev => ({ ...prev, venda: vendas.find(v => v.id === parseInt(value)) || null }));
        } else {
            setPagamento(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await pagamentoService.update(id, pagamento);
                setModalMessage("Pagamento atualizado com sucesso!");
            } else {
                await pagamentoService.create(pagamento);
                setModalMessage("Pagamento criado com sucesso!");
            }
            setShowModal(true);
            setTimeout(() => navigate('/pagamentos'), 2000);
        } catch (err) {
            console.error("Erro ao salvar pagamento:", err);
            setModalMessage("Erro ao salvar pagamento.");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (loading) return <div className="text-center p-4">Carregando dados do pagamento...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="form-container">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Pagamento' : 'Novo Pagamento'}</h2>
            <form onSubmit={handleSubmit}>
                {id && (
                    <div className="form-field">
                        <label className="form-label">ID:</label>
                        <input type="text" name="id" value={id} readOnly className="form-input" />
                    </div>
                )}
                <div className="form-field">
                    <label className="form-label">Status:</label>
                    <input type="text" name="status" value={pagamento.status} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Método:</label>
                    <input type="text" name="metodo" value={pagamento.metodo} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Data do Pagamento:</label>
                    <input type="date" name="dataPagamento" value={pagamento.dataPagamento} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Descrição:</label>
                    <textarea name="descricao" value={pagamento.descricao} onChange={handleChange} className="form-input"></textarea>
                </div>
                <div className="form-field">
                    <label className="form-label">Venda:</label>
                    <select name="venda" value={pagamento.venda ? pagamento.venda.id : ''} onChange={handleChange} className="form-input">
                       <option value="">Selecione uma venda</option>
                        {vendas.map(sale => (
                            <option key={sale.id} value={sale.id}>
                                {`${sale.nomeVeiculo || 'Veículo Desconhecido'} - ${sale.nomeUsuario || 'Usuário Desconhecido'}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/pagamentos')} className="cancel-button">
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

export default PagamentoDetail;
