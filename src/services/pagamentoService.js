import api from './api';

const pagamentoService = {
    getAll: () => api.get('pagamentos'),
    getById: (id) => api.get(`pagamentos/${id}`),
    create: (data) => api.post('pagamentos', data),
    update: (id, data) => api.put(`pagamentos/${id}`, data),
    delete: (id) => api.delete(`pagamentos/${id}`),
};

export default pagamentoService;
