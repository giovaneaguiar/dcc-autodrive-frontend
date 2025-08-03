import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AnuncioList from './pages/AnuncioList';
import AnuncioDetail from './pages/AnuncioDetail';
import CategoriaDetail from './pages/CategoriaDetail';
import CategoriaList from './pages/CategoriaList';

function App() {
    return (
        <Router>
            <Routes>
            <Route path="/" element={<h1>Bem-vindo ao AutoDrive</h1>} />            
            </Routes>
            <h2>Menu de Funcionalidades</h2>
            <nav>
                <ul>
                    <li><Link to="/anuncios">Anúncios</Link></li>
                    <li><Link to="/categorias">Categorias</Link></li>
                    
                </ul>
            </nav>
            
            <Routes>
                <Route path="/anuncios" element={<AnuncioList />} />
                <Route path="/anuncios/new" element={<AnuncioDetail />} />
                <Route path="/anuncios/edit/:id" element={<AnuncioDetail />} />
                <Route path="/categorias" element={<CategoriaList />} />
                <Route path="/categorias/new" element={<CategoriaDetail />} />
                <Route path="/categorias/edit/:id" element={<CategoriaDetail />} />
            </Routes>
        </Router>
    );
}

export default App;