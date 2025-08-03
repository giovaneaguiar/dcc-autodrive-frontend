import api from './api';

const veiculoService = {
    getAll: () => api.get('veiculos'),
    getById: (id) => api.get(`veiculos/${id}`),
    create: (data) => api.post('veiculos', data),
    update: (id, data) => api.put(`veiculos/${id}`, data),
    delete: (id) => api.delete(`veiculos/${id}`),
};

export default veiculoService;