import api from './api';

const propostaService = {
    getAll: () => api.get('propostas'),
    getById: (id) => api.get(`propostas/${id}`),
    create: (data) => api.post('propostas', data),
    update: (id, data) => api.put(`propostas/${id}`, data),
    delete: (id) => api.delete(`propostas/${id}`),
};

export default propostaService;
