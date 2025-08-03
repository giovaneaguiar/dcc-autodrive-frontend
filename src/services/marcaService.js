import api from './api';

const marcaService = {
    getAll: () => api.get('marcas'),
    getById: (id) => api.get(`marcas/${id}`),
    create: (data) => api.post('marcas', data),
    update: (id, data) => api.put(`marcas/${id}`, data),
    delete: (id) => api.delete(`marcas/${id}`),
};

export default marcaService;