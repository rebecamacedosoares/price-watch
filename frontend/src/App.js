import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [newProductName, setNewProductName] = useState('');
  const [newProductUrl, setNewProductUrl] = useState('');
  const [newProductTargetPrice, setNewProductTargetPrice] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/products/');
      if (!response.ok) throw new Error("A resposta da rede não foi boa");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormError('');
    const newProduct = { name: newProductName, url: newProductUrl, target_price: newProductTargetPrice };

    try {
      const response = await fetch('http://localhost:8000/api/products/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.url?.[0] || 'Falha ao criar o produto. Verifique os dados.';
        throw new Error(errorMessage);
      }
      
      setNewProductName('');
      setNewProductUrl('');
      setNewProductTargetPrice('');
      fetchProducts();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      setFormError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async (productId) => {
    if (!window.confirm("Tem certeza que deseja remover este produto?")) return;

    try {
      const response = await fetch(`http://localhost:8000/api/products/${productId}/`, {
        method: 'DELETE',
      });
      if (response.status !== 204) throw new Error('Falha ao deletar o produto');
      fetchProducts();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto.");
    }
  };
  
  const formatDate = (dateString) => {
      if (!dateString) return 'Nunca';
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString('pt-BR', options);
  }

  return (
    <div className="App">
      <header className="app-header"><h1>PriceWatch</h1></header>
      <main className="container">
        <section className="form-section">
          <h2>Adicionar Novo Produto</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="product-name">Nome do Produto</label>
            <input id="product-name" type="text" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} placeholder="Ex: Livro O Hobbit" required />
            
            <label htmlFor="product-url">URL do Produto</label>
            <input id="product-url" type="url" value={newProductUrl} onChange={(e) => setNewProductUrl(e.target.value)} placeholder="https://..." required />

            <label htmlFor="product-price">Preço Alvo (R$)</label>
            <input id="product-price" type="number" step="0.01" value={newProductTargetPrice} onChange={(e) => setNewProductTargetPrice(e.target.value)} placeholder="Ex: 35.50" required />
            
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adicionando...' : 'Adicionar Produto'}
            </button>
            {formError && <p className="form-error">{formError}</p>} 
          </form>
        </section>

        <section className="product-section">
          <h2>Meus Produtos Monitorados</h2>
          {loading ? <p>Carregando produtos...</p> : (
            <div className="product-list">
              {products.length > 0 ? (
                products.map(product => {
                    const isPriceGood = product.current_price && parseFloat(product.current_price) <= parseFloat(product.target_price);
                    
                    return (
                        <div key={product.id} className={`product-card ${isPriceGood ? 'is-on-sale' : ''}`}>
                            <button className="delete-btn" title="Remover produto" onClick={() => handleDelete(product.id)}>×</button>
                            <h3>{product.name}</h3>
                            <p><strong>Preço Alvo:</strong> R$ {product.target_price}</p>
                            <p className={product.current_price ? 'price-ok' : 'price-pending'}>
                                <strong>Preço Atual:</strong> {product.current_price ? `R$ ${product.current_price}` : 'Aguardando verificação...'}
                            </p>
                            <p className="last-checked">Última verificação: {formatDate(product.last_checked)}</p>
                            <a href={product.url} target="_blank" rel="noopener noreferrer">Ver Produto</a>
                        </div>
                    );
                })
              ) : <p>Nenhum produto cadastrado ainda.</p>}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
export default App;