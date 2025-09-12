import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [newProductName, setNewProductName] = useState('');
  const [newProductUrl, setNewProductUrl] = useState('');
  const [newProductTargetPrice, setNewProductTargetPrice] = useState('');
  
  const { authTokens, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    if (!authTokens) {
        setLoading(false);
        return;
    }
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/products/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${authTokens.access}`
        }
      });
      if (response.status === 401) {
        logoutUser();
        return;
      }
      if (!response.ok) throw new Error("A resposta da rede não foi boa");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [authTokens, logoutUser]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    const newProduct = { name: newProductName, url: newProductUrl, target_price: newProductTargetPrice };
    try {
      const response = await fetch('http://localhost:8000/api/products/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `JWT ${authTokens.access}`
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        let errorMessage = 'Falha ao criar o produto. Verifique os dados.';
        if (errorData.non_field_errors) {
          errorMessage = "Você já está monitorando um produto com esta URL.";
        } else if (errorData.url) {
          errorMessage = `URL: ${errorData.url[0]}`;
        }
        throw new Error(errorMessage);
      }
      setNewProductName('');
      setNewProductUrl('');
      setNewProductTargetPrice('');
      await fetchProducts();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (productId, event) => {
    event.stopPropagation();
    if (!window.confirm("Tem certeza que deseja remover este produto?")) return;
    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}/`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `JWT ${authTokens.access}`
        }
      });
      if (response.status !== 204) throw new Error('Falha ao deletar o produto');
      await fetchProducts();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto.");
    }
  };
  
  const handleCardClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const formatDate = (dateString) => {
      if (!dateString) return 'Nunca';
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('pt-BR', options);
  }

  return (
    <>
      <section className="form-section">
        <h2>Adicionar Novo Produto</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="product-name">Nome do Produto</label>
          <input id="product-name" type="text" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} placeholder="Ex: Livro O Hobbit" required />
          <label htmlFor="product-url">URL do Produto</label>
          <input id="product-url" type="url" value={newProductUrl} onChange={(e) => setNewProductUrl(e.target.value)} placeholder="https://..." required />
          <label htmlFor="product-price">Preço Alvo (R$)</label>
          <input id="product-price" type="number" step="0.01" value={newProductTargetPrice} onChange={(e) => setNewProductTargetPrice(e.target.value)} placeholder="Ex: 35.50" required />
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Adicionando...' : 'Adicionar Produto'}</button>
          {formError && <p className="form-error">{formError}</p>} 
        </form>
      </section>

      <section className="product-section">
        <h2>Meus Produtos Monitorados</h2>
        {loading ? <p>Carregando produtos...</p> : (
          <div className="product-list">
            {authTokens && products.length > 0 ? (
              products.map(product => {
                  const isPriceGood = product.current_price && parseFloat(product.current_price) <= parseFloat(product.target_price);
                  return (
                      <div key={product.id} className={`product-card ${isPriceGood ? 'is-on-sale' : ''}`} onClick={() => handleCardClick(product.id)}>
                          <button className="delete-btn" title="Remover produto" onClick={(e) => handleDelete(product.id, e)}>×</button>
                          <h3>{product.name}</h3>
                          <p><strong>Preço Alvo:</strong> R$ {product.target_price}</p>
                          <p className={product.current_price ? 'price-ok' : 'price-pending'}>
                              <strong>Preço Atual:</strong> {product.current_price ? `R$ ${product.current_price}` : 'Aguardando verificação...'}
                          </p>
                          <p className="last-checked">Última verificação: {formatDate(product.last_checked)}</p>
                          <a href={product.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>Ver Produto na Loja</a>
                      </div>
                  );
              })
            ) : <p>Faça login para ver seus produtos ou cadastre um novo item acima.</p>}
          </div>
        )}
      </section>
    </>
  );
};

export default DashboardPage;