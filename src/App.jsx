import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AnuncioList from './pages/AnuncioList';
import AnuncioDetail from './pages/AnuncioDetail';
import CategoriaDetail from './pages/CategoriaDetail';
import CategoriaList from './pages/CategoriaList';
import EmpresaList from './pages/EmpresaList';
import EmpresaDetail from './pages/EmpresaDetail';
import FavoritoList from './pages/FavoritoList';
import FavoritoDetail from './pages/FavoritoDetail';
import FinanciamentoList from './pages/FinanciamentoList';
import FinanciamentoDetail from './pages/FinanciamentoDetail';

// import FotoList from './pages/FotoList';
// import MarcaList from './pages/MarcaList';
// import NotificacaoList from './pages/NotificacaoList';
// import OpcionalList from './pages/OpcionalList';
// import PagamentoList from './pages/PagamentoList';
// import PropostaList from './pages/PropostaList';
// import TipoList from './pages/TipoList';
// import UsuarioList from './pages/UsuarioList';
// import VeiculoList from './pages/VeiculoList';
// import VendaList from './pages/VendaList';

function App() {
  return (
    <Router>
      <div className="app-container">
        <h1>Bem-vindo ao AutoDrive</h1>
        <div className="menu-container">
          <nav>
            <ul className="menu-list">
              <li>
                <Link to="/anuncios">Anúncios</Link>
              </li>
              <li>
                <Link to="/categorias">Categorias</Link>
              </li>
              <li>
                <Link to="/empresas">Empresas</Link>
              </li>
              <li>
                <Link to="/favoritos">Favoritos</Link>
              </li>
              <li>
                <Link to="/financiamentos">Financiamentos</Link>
              </li>
              <li>
                <Link to="/fotos">Fotos</Link>
              </li>
              <li>
                <Link to="/marcas">Marcas</Link>
              </li>
              <li>
                <Link to="/notificacoes">Notificações</Link>
              </li>
              <li>
                <Link to="/opcionais">Opcionais</Link>
              </li>
              <li>
                <Link to="/pagamentos">Pagamentos</Link>
              </li>
              <li>
                <Link to="/propostas">Propostas</Link>
              </li>
              <li>
                <Link to="/tipos">Tipos</Link>
              </li>
              <li>
                <Link to="/usuarios">Usuários</Link>
              </li>
              <li>
                <Link to="/veiculos">Veículos</Link>
              </li>
              <li>
                <Link to="/vendas">Vendas</Link>
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
          <Route path="/empresas" element={<EmpresaList />} />
          <Route path="/empresas/new" element={<EmpresaDetail />} />
          <Route path="/empresas/edit/:id" element={<EmpresaDetail />} />
          <Route path="/favoritos" element={<FavoritoList />} />
          <Route path="/favoritos/new" element={<FavoritoDetail />}/>
          <Route path="/favoritos/edit/:id" element={<FavoritoDetail />}/>
          <Route path="/financiamentos" element={<FinanciamentoList />} />
          <Route path="/financiamentos/new" element={<FinanciamentoDetail />}/>
          <Route path="/financiamentos/edit/:id" element={<FinanciamentoDetail />}/>


        </Routes>
      </div>
    </Router>
  );
}

export default App;
