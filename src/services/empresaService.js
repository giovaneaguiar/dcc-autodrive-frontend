import api from './api';

const empresaService = {
    getAll: () => api.get('empresas'),
    getById: (id) => api.get(`empresas/${id}`),
    create: (data) => api.post('empresas', data),
    update: (id, data) => api.put(`empresas/${id}`, data),
    delete: (id) => api.delete(`empresas/${id}`),
};

export default empresaService;