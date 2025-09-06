import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newProductName, setNewProductName] = useState('');
  const [newProductUrl, setNewProductUrl] = useState('');
  const [newProductTargetPrice, setNewProductTargetPrice] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/products/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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
    
    const newProduct = {
      name: newProductName,
      url: newProductUrl,
      target_price: newProductTargetPrice,
    };

    try {
      const response = await fetch('http://localhost:8000/api/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error('Falha ao criar o produto');
      }

      setNewProductName('');
      setNewProductUrl('');
      setNewProductTargetPrice('');
      fetchProducts();

    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      alert("Erro ao adicionar produto. Verifique o console para mais detalhes.");
    }
  };


  return (
    <div className="App">
      <header className="app-header">
        <h1>Price Watch</h1>
      </header>
      <main className="container">
        <section className="form-section">
          <h2>Adicionar Novo Produto</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              placeholder="Nome do Produto (ex: Livro O Hobbit)"
              required
            />
            <input
              type="url"
              value={newProductUrl}
              onChange={(e) => setNewProductUrl(e.target.value)}
              placeholder="URL do Produto"
              required
            />
            <input
              type="number"
              step="0.01"
              value={newProductTargetPrice}
              onChange={(e) => setNewProductTargetPrice(e.target.value)}
              placeholder="Preço Alvo (ex: 35.50)"
              required
            />
            <button type="submit">Adicionar</button>
          </form>
        </section>

        <section className="product-section">
          <h2>Meus Produtos Monitorados</h2>
          {loading ? (
            <p>Carregando produtos...</p>
          ) : (
            <div className="product-list">
              {products.length > 0 ? (
                products.map(product => (
                  <div key={product.id} className="product-card">
                    <h3>{product.name}</h3>
                    <p><strong>Preço Alvo:</strong> R$ {product.target_price}</p>
                    <p className={product.current_price ? 'price-ok' : 'price-pending'}>
                      <strong>Preço Atual:</strong> {product.current_price ? `R$ ${product.current_price}` : 'Aguardando verificação...'}
                    </p>
                    <a href={product.url} target="_blank" rel="noopener noreferrer">Ver Produto</a>
                  </div>
                ))
              ) : (
                <p>Nenhum produto cadastrado ainda.</p>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;