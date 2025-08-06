import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import veiculoService from '../services/veiculoService';
import empresaService from '../services/empresaService';
import categoriaService from '../services/categoriaService';
import marcaService from '../services/marcaService';
import opcionalService from '../services/opcionalService';
import tipoService from '../services/tipoService';
import fotoService from '../services/fotoService';

function VeiculoDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [veiculo, setVeiculo] = useState({
        placa: '',
        modelo: '',
        cor: '',
        ano: '',
        versao: '',
        quilometragem: '',
        descricao: '',
        preco: '',
        ativo: false,
        condicao: '',
        anuncio: '',
        empresa: null,
        categoria: null,
        marca: null,
        opcional: null,
        tipo: null,
        foto: null,
    });
    const [empresas, setEmpresas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [opcionais, setOpcionais] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [fotos, setFotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const condicoesVeiculo = ["NOVO", "SEMINOVO", "USADO"];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [
                    empresasResponse,
                    categoriasResponse,
                    marcasResponse,
                    opcionaisResponse,
                    tiposResponse,
                    fotosResponse,
                ] = await Promise.all([
                    empresaService.getAll(),
                    categoriaService.getAll(),
                    marcaService.getAll(),
                    opcionalService.getAll(),
                    tipoService.getAll(),
                    fotoService.getAll(),
                ]);

                setEmpresas(empresasResponse.data);
                setCategorias(categoriasResponse.data);
                setMarcas(marcasResponse.data);
                setOpcionais(opcionaisResponse.data);
                setTipos(tiposResponse.data);
                setFotos(fotosResponse.data);

                if (id) {
                    const veiculoResponse = await veiculoService.getById(id);
                    setVeiculo({
                        ...veiculoResponse.data,
                        anuncio: veiculoResponse.data.anuncio ? new Date(veiculoResponse.data.anuncio).toISOString().split('T')[0] : ''
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
        if (name === 'empresa') {
            setVeiculo(prev => ({ ...prev, empresa: empresas.find(item => item.id === parseInt(value)) || null }));
        } else if (name === 'categoria') {
            setVeiculo(prev => ({ ...prev, categoria: categorias.find(item => item.id === parseInt(value)) || null }));
        } else if (name === 'marca') {
            setVeiculo(prev => ({ ...prev, marca: marcas.find(item => item.id === parseInt(value)) || null }));
        } else if (name === 'opcional') {
            setVeiculo(prev => ({ ...prev, opcional: opcionais.find(item => item.id === parseInt(value)) || null }));
        } else if (name === 'tipo') {
            setVeiculo(prev => ({ ...prev, tipo: tipos.find(item => item.id === parseInt(value)) || null }));
        } else if (name === 'foto') {
            setVeiculo(prev => ({ ...prev, foto: fotos.find(item => item.id === parseInt(value)) || null }));
        } else {
            setVeiculo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await veiculoService.update(id, veiculo);
                setModalMessage("Veículo atualizado com sucesso!");
            } else {
                await veiculoService.create(veiculo);
                setModalMessage("Veículo criado com sucesso!");
            }
            setShowModal(true);
            setTimeout(() => navigate('/veiculos'), 2000);
        } catch (err) {
            console.error("Erro ao salvar veículo:", err);
            setModalMessage("Erro ao salvar veículo.");
            setShowModal(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
    };

    if (loading) return <div className="text-center p-4">Carregando dados do veículo...</div>;
    if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

    return (
        <div className="form-container">
            <h2 className="text-2xl font-bold mb-4">{id ? 'Editar Veículo' : 'Novo Veículo'}</h2>
            <form onSubmit={handleSubmit}>
                {id && (
                    <div className="form-field">
                        <label className="form-label">ID:</label>
                        <input type="text" name="id" value={id} readOnly className="form-input" />
                    </div>
                )}
                <div className="form-field">
                    <label className="form-label">Placa:</label>
                    <input type="text" name="placa" value={veiculo.placa} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Modelo:</label>
                    <input type="text" name="modelo" value={veiculo.modelo} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Cor:</label>
                    <input type="text" name="cor" value={veiculo.cor} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Ano:</label>
                    <input type="text" name="ano" value={veiculo.ano} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Versão:</label>
                    <input type="text" name="versao" value={veiculo.versao} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Quilometragem:</label>
                    <input type="text" name="quilometragem" value={veiculo.quilometragem} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">Descrição:</label>
                    <textarea name="descricao" value={veiculo.descricao} onChange={handleChange} className="form-input"></textarea>
                </div>
                <div className="form-field">
                    <label className="form-label">Preço:</label>
                    <input type="number" name="preco" value={veiculo.preco} onChange={handleChange} className="form-input" />
                </div>
                <div className="form-field">
                    <label className="form-label">
                        Ativo:
                        <input type="checkbox" name="ativo" checked={veiculo.ativo} onChange={handleChange} className="ml-2" />
                    </label>
                </div>
                <div className="form-field">
                    <label className="form-label">Condição:</label>
                    <select name="condicao" value={veiculo.condicao} onChange={handleChange} className="form-input">
                        <option value="">Selecione a condição</option>
                        {condicoesVeiculo.map(cond => (
                            <option key={cond} value={cond}>{cond}</option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label className="form-label">Data Anúncio:</label>
                    <input type="date" name="anuncio" value={veiculo.anuncio} onChange={handleChange} className="form-input" />
                </div>

                {/* Dropdowns para relacionamentos ManyToOne */}
                <div className="form-field">
                    <label className="form-label">Empresa:</label>
                    <select name="empresa" value={veiculo.empresa ? veiculo.empresa.id : ''} onChange={handleChange} className="form-input">
                        <option value="">Selecione uma empresa</option>
                        {empresas.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label className="form-label">Categoria:</label>
                    <select name="categoria" value={veiculo.categoria ? veiculo.categoria.id : ''} onChange={handleChange} className="form-input">
                        <option value="">Selecione uma categoria</option>
                        {categorias.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.descricao}</option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label className="form-label">Marca:</label>
                    <select name="marca" value={veiculo.marca ? veiculo.marca.id : ''} onChange={handleChange} className="form-input">
                        <option value="">Selecione uma marca</option>
                        {marcas.map(m => (
                            <option key={m.id} value={m.id}>{m.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label className="form-label">Opcional:</label>
                    <select name="opcional" value={veiculo.opcional ? veiculo.opcional.id : ''} onChange={handleChange} className="form-input">
                        <option value="">Selecione um opcional</option>
                        {opcionais.map(opc => (
                            <option key={opc.id} value={opc.id}>{opc.descricao}</option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label className="form-label">Tipo:</label>
                    <select name="tipo" value={veiculo.tipo ? veiculo.tipo.id : ''} onChange={handleChange} className="form-input">
                        <option value="">Selecione um tipo</option>
                        {tipos.map(t => (
                            <option key={t.id} value={t.id}>{t.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="form-field">
                    <label className="form-label">Foto:</label>
                    <select name="foto" value={veiculo.foto ? veiculo.foto.id : ''} onChange={handleChange} className="form-input">
                        <option value="">Selecione uma foto</option>
                        {fotos.map(f => (
                            <option key={f.id} value={f.id}>{f.foto ? f.foto.substring(0, 50) + '...' : `Foto ID: ${f.id}`}</option>
                        ))}
                    </select>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/veiculos')} className="cancel-button">
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

export default VeiculoDetail;
