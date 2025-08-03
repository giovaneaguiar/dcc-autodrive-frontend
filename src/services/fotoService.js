import api from './api';

const fotoService = {
    getAll: () => api.get('fotos'),
    getById: (id) => api.get(`fotos/${id}`),
    create: (data) => api.post('fotos', data),
    update: (id, data) => api.put(`fotos/${id}`, data),
    delete: (id) => api.delete(`fotos/${id}`),
};

export default fotoService;
