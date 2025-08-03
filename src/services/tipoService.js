import api from './api';

const tipoService = {
    getAll: () => api.get('tipos'),
    getById: (id) => api.get(`tipos/${id}`),
    create: (data) => api.post('tipos', data),
    update: (id, data) => api.put(`tipos/${id}`, data),
    delete: (id) => api.delete(`tipos/${id}`),
};

export default tipoService;