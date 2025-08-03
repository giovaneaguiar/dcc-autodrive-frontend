// src/services/categoriaService.js
import api from './api';

const categoriaService = {
    getAll: () => api.get('categorias'),
    getById: (id) => api.get(`categorias/${id}`),
    create: (data) => api.post('categorias', data),
    update: (id, data) => api.put(`categorias/${id}`, data),
    delete: (id) => api.delete(`categorias/${id}`),
};

export default categoriaService;