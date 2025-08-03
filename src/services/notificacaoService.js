import api from './api';

const notificacaoService = {
    getAll: () => api.get('notificacoes'),
    getById: (id) => api.get(`notificacoes/${id}`),
    create: (data) => api.post('notificacoes', data),
    update: (id, data) => api.put(`notificacoes/${id}`, data),
    delete: (id) => api.delete(`notificacoes/${id}`),
};

export default notificacaoService;