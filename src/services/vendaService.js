import api from './api';

const vendaService = {
    getAll: () => api.get('vendas'),
    getById: (id) => api.get(`vendas/${id}`),
    create: (data) => api.post('vendas', data),
    update: (id, data) => api.put(`vendas/${id}`, data),
    delete: (id) => api.delete(`vendas/${id}`),
};

export default vendaService;