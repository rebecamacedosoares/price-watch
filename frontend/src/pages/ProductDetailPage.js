import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authTokens, logoutUser } = useContext(AuthContext);

    const fetchProductData = useCallback(async () => {
        if (!authTokens) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const productResponse = await fetch(`http://localhost:8000/api/products/${productId}/`, {
                headers: { 'Authorization': `JWT ${authTokens.access}` }
            });
            if(productResponse.status === 401) {
                logoutUser();
                return;
            }
            const productData = await productResponse.json();
            setProduct(productData);

            const historyResponse = await fetch(`http://localhost:8000/api/products/${productId}/history/`, {
                headers: { 'Authorization': `JWT ${authTokens.access}` }
            });
            if(historyResponse.status === 401) {
                logoutUser();
                return;
            }
            const historyData = await historyResponse.json();
            
            const formattedHistory = historyData.map(item => ({
                price: parseFloat(item.price),
                date: new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
            })).reverse();
            
            setHistory(formattedHistory);

        } catch (error) {
            console.error("Falha ao buscar dados do produto:", error);
        } finally {
            setLoading(false);
        }
    }, [productId, authTokens, logoutUser]);

    useEffect(() => {
        fetchProductData();
    }, [fetchProductData]);

    if (loading) {
        return <div className="loading-message">Carregando detalhes do produto...</div>;
    }

    if (!product) {
        return <div className="loading-message">Produto não encontrado ou acesso não autorizado.</div>;
    }

    return (
        <div className="product-detail-container">
            <Link to="/" className="back-link">‹ Voltar para o Dashboard</Link>
            <h1>{product.name}</h1>
            
            <div className="detail-cards-container">
                <div className="detail-card">
                    <h2>Preço Alvo</h2>
                    <p className="price-target">R$ {product.target_price}</p>
                </div>
                <div className="detail-card">
                    <h2>Preço Atual</h2>
                    <p className="price-current">{product.current_price ? `R$ ${product.current_price}` : 'N/A'}</p>
                </div>
            </div>

            <h2>Histórico de Preços</h2>
            <div className="chart-container">
                {history.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={history} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                            <XAxis dataKey="date" stroke="#e0e0e0" />
                            <YAxis stroke="#e0e0e0" domain={['dataMin - 1', 'dataMax + 1']} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#2a2a3e', border: '1px solid #444', color: '#e0e0e0' }}
                                formatter={(value) => [`R$ ${value.toFixed(2)}`, 'Preço']}
                            />
                            <Legend wrapperStyle={{ color: '#e0e0e0' }}/>
                            <Line type="monotone" dataKey="price" name="Preço (R$)" stroke="#00f5c0" strokeWidth={2} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p>Nenhum histórico de preço para este produto ainda.</p>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;