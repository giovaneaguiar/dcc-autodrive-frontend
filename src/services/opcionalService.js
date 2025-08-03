import api from './api';

const opcionalService = {
    getAll: () => api.get('opcionais'),
    getById: (id) => api.get(`opcionais/${id}`),
    create: (data) => api.post('opcionais', data),
    update: (id, data) => api.put(`opcionais/${id}`, data),
    delete: (id) => api.delete(`opcionais/${id}`),
};

export default opcionalService;
