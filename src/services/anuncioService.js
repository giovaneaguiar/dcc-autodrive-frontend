import api from './api';

const anuncioService = {
    getAll: () => api.get('anuncios'),
    getById: (id) => api.get(`anuncios/${id}`),
    create: (data) => api.post('anuncios', data),
    update: (id, data) => api.put(`anuncios/${id}`, data),
    delete: (id) => api.delete(`anuncios/${id}`),
};

export default anuncioService;