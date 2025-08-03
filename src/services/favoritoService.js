import api from './api';

const favoritoService = {
    getAll: () => api.get('favoritos'),
    getById: (id) => api.get(`favoritos/${id}`),
    create: (data) => api.post('favoritos', data),
    update: (id, data) => api.put(`favoritos/${id}`, data),
    delete: (id) => api.delete(`favoritos/${id}`),
};

export default favoritoService;