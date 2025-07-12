'use client';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import Header from '@/components/Header';
import { useEffect, useState } from 'react';

export default function PedidosFeitos() {
    const [pedidos, setPedidos] = useState([]);
    const [mostrarDetalhes, setMostrarDetalhes] = useState(null);
    const [filtro, setFiltro] = useState('aguardando');
    const [buscaNome, setBuscaNome] = useState('');

    function ajustarParaRondonia(dataString) {
        const dataOriginal = new Date(dataString);
        dataOriginal.setHours(dataOriginal.getHours() - 4);
        return dataOriginal.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    }

    const fetchPedidos = async () => {
        try {
            const response = await fetch(`https://apisweetcandy.dev.vilhena.ifro.edu.br/admin/pedidos?filtro=${filtro}`);
            const data = await response.json();

            const agrupadosPorCliente = {};
            data.forEach(pedido => {
                const chave = pedido.email_cliente;

                if (!agrupadosPorCliente[chave]) {
                    agrupadosPorCliente[chave] = {
                        ...pedido,
                        cupcakes: [...pedido.cupcakes],
                        ids: [pedido.id_pedido],
                        valor_total: parseFloat(pedido.valor_total || 0)
                    };
                } else {
                    agrupadosPorCliente[chave].cupcakes.push(...pedido.cupcakes);
                    agrupadosPorCliente[chave].ids.push(pedido.id_pedido);
                    agrupadosPorCliente[chave].valor_total += parseFloat(pedido.valor_total || 0);
                }
            });

            setPedidos(Object.values(agrupadosPorCliente));
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
        }
    };

    useEffect(() => {
        fetchPedidos();
    }, [filtro]);

    const mudarStatus = async (ids) => {
        try {
            const resultados = await Promise.all(ids.map(async (id) => {
                const resposta = await fetch(`https://apisweetcandy.dev.vilhena.ifro.edu.br/admin/pedidos/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'finalizado' })
                });

                const dados = await resposta.json();
                console.log(`Pedido ${id} →`, dados);
                return resposta.ok;
            }));

            if (resultados.every(ok => ok)) {
                await fetchPedidos();
                setMostrarDetalhes(null);
            } else {
                alert("Alguns pedidos não foram atualizados. Veja o console.");
            }
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    const fecharDetalhes = (e) => {
        if (e.target.id === 'overlay') {
            setMostrarDetalhes(null);
        }
    };

    const pedidosFiltrados = pedidos.filter(p =>
        p.nome_completo.toLowerCase().includes(buscaNome.toLowerCase())
    );

    return (
        <div>
            <Header />
            <div>
                <form className={styles.form}>
                    <h1 className={styles.h1}>Pedidos feitos</h1>

                    <div className={styles.botoesCima}>
                        <button type="button" className={styles.buttonCima} onClick={() => setFiltro('aguardando')}>
                            Preparando
                        </button>
                        <button type="button" className={styles.buttonCima} onClick={() => setFiltro('finalizado')}>
                            Finalizados
                        </button>
                    </div>

                    <div style={{ position: 'relative', width: '100%' }}>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Digite o nome do cliente"
                            value={buscaNome}
                            onChange={(e) => setBuscaNome(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                        <img
                            className={styles.icon}
                            src="/images/lupa.png"
                            alt="Ícone de busca"
                            style={{
                                position: 'absolute',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '23px',
                                height: '23px',
                                pointerEvents: 'none',
                            }}
                        />
                    </div>

                    {pedidosFiltrados.map(pedido => (
                        <div key={pedido.email_cliente} className={styles.detalhePedido}>
                            <div className={styles.idData}>
                                <p className={styles.id}>Cliente: {pedido.nome_completo}</p>
                                <p className={styles.data}>Data: {ajustarParaRondonia(pedido.data_criacao)}</p>
                            </div>

                            <button
                                type="button"
                                className={styles.button}
                                onClick={() => setMostrarDetalhes(pedido.email_cliente)}
                            >
                                {mostrarDetalhes === pedido.email_cliente ? 'Ocultar detalhes' : 'Mostrar detalhes'}
                            </button>

                            {mostrarDetalhes === pedido.email_cliente && (
                                <div id="overlay" className={styles.overlay} onClick={fecharDetalhes}>
                                    <div className={styles.detalhesExtras} onClick={(e) => e.stopPropagation()}>
                                        <div className={styles.divDetalhes}>
                                            <p><strong>Nome:</strong> {pedido.nome_completo}</p>
                                            <p><strong>Email:</strong> {pedido.email_cliente}</p>
                                            <p><strong>Valor Total:</strong> R$ {parseFloat(pedido.valor_total).toFixed(2)}</p>
                                            {pedido.forma_pagamento && (
                                                <p><strong>Pagamento:</strong> {pedido.forma_pagamento}</p>
                                            )}
                                        </div>

                                        {pedido.cupcakes && pedido.cupcakes.length > 0 ? (
                                            pedido.cupcakes.map((cupcake, index) => (
                                                <div key={index} className={styles.divDetalhes}>
                                                    <p><strong>Tamanho:</strong> {cupcake.tamanho || 'Não especificado'}</p>
                                                    <p><strong>Recheio:</strong> {cupcake.recheio || 'Não especificado'}</p>
                                                    <p><strong>Cobertura:</strong> {cupcake.cobertura || 'Não especificado'}</p>
                                                    <p><strong>Cor da cobertura:</strong> {cupcake.cor_cobertura || 'Não especificado'}</p>
                                                    <p><strong>Quantidade:</strong> {cupcake.quantidade || 1}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className={styles.divDetalhes}>
                                                <p>Nenhum cupcake detalhado para este pedido.</p>
                                            </div>
                                        )}

                                        <div className={styles.divDetalhes}>
                                            <p><strong>Rua:</strong> {pedido.rua || 'Não informado'}</p>
                                            <p><strong>Número:</strong> {pedido.numero || 'Não informado'}</p>
                                            <p><strong>Bairro:</strong> {pedido.bairro || 'Não informado'}</p>
                                            <p><strong>CEP:</strong> {pedido.cep || 'Não informado'}</p>
                                            <p><strong>Complemento:</strong> {pedido.complemento || 'Não informado'}</p>
                                        </div>

                                        <div className={styles.divDetalhes}>
                                            <p><strong>Status:</strong> {pedido.status === 'aguardando' ? 'Preparando' : 'Finalizado'}</p>
                                        </div>

                                        {pedido.status === 'aguardando' && (
                                            <button
                                                className={styles.buttonMarcarConcluido}
                                                onClick={() => mudarStatus(pedido.ids)}
                                            >
                                                Marcar como finalizado
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </form>
            </div>
            <Footer />
        </div>
    );
}