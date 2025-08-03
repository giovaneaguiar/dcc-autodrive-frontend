import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AnuncioList from './pages/AnuncioList';
import AnuncioDetail from './pages/AnuncioDetail';
import CategoriaDetail from './pages/CategoriaDetail';
import CategoriaList from './pages/CategoriaList';

// O CSS que você tem no arquivo global centraliza o elemento #root.
// Para garantir que todo o seu conteúdo seja tratado como um único bloco,
// o envolvemos em uma única div.

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<h1>Bem-vindo ao AutoDrive</h1>} />
        </Routes>
        <div>
          <h2>Menu de Funcionalidades</h2>
        </div>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/anuncios">Anúncios</Link>
              </li>
              <li>
                <Link to="/categorias">Categorias</Link>
              </li>
            </ul>
          </nav>
        </div>
        <Routes>
          <Route path="/anuncios" element={<AnuncioList />} />
          <Route path="/anuncios/new" element={<AnuncioDetail />} />
          <Route path="/anuncios/edit/:id" element={<AnuncioDetail />} />
          <Route path="/categorias" element={<CategoriaList />} />
          <Route path="/categorias/new" element={<CategoriaDetail />} />
          <Route path="/categorias/edit/:id" element={<CategoriaDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
