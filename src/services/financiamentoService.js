import api from './api';

const financiamentoService = {
    getAll: () => api.get('financiamentos'),
    getById: (id) => api.get(`financiamentos/${id}`),
    create: (data) => api.post('financiamentos', data),
    update: (id, data) => api.put(`financiamentos/${id}`, data),
    delete: (id) => api.delete(`financiamentos/${id}`),
};

export default financiamentoService;