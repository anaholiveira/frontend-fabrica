'use client'
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Checkout = () => {
  const [pagamento, setPagamento] = useState('');
  const [resumo, setResumo] = useState(null);

  async function fetchResumo(clienteId) {
    try {
      const response = await fetch(`https://apisweetcandy.dev.vilhena.ifro.edu.br/resumo/${clienteId}`);
      const data = await response.json();

      if (response.ok) {
        setResumo(data);
      } else {
        console.error('Erro ao obter resumo:', data.erro);
        setResumo(null);
      }
    } catch (error) {
      console.error('Erro ao conectar com a API de resumo:', error);
      setResumo(null);
    }
  }

  const handleLimparPedido = async () => {
    const clienteId = localStorage.getItem('clienteId');

    if (!clienteId) {
      alert('ID do cliente não encontrado. Faça login novamente.');
      return;
    }

    try {
      const response = await fetch(`https://apisweetcandy.dev.vilhena.ifro.edu.br/pedidos/aguardando/${clienteId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensagem || 'Pedido limpo com sucesso!');
        await fetchResumo(clienteId); // Atualiza o resumo na tela
      } else {
        alert('Erro ao limpar pedido: ' + (data.erro || 'Erro desconhecido'));
      }
    } catch (error) {
      alert('Erro ao conectar com a API: ' + error.message);
    }
  };

  useEffect(() => {
    const clienteId = localStorage.getItem('clienteId');

    if (!clienteId) {
      alert('ID do cliente não encontrado. Faça login novamente.');
      return;
    }

    fetchResumo(clienteId);
  }, []);

  return (
    <div>
      <Header />

      <div className={styles.container}>
        <h1 className={styles.h1}>Checkout</h1>
        <h2 className={styles.h2}>Formas de Pagamento</h2>

        <div className={styles.pagamentos}>
          <label className={styles.label}>
            <input className={styles.input} type="radio" name="pagamento" onChange={() => setPagamento('pix')} /> Pix
          </label>
          <label className={styles.label}>
            <input className={styles.input} type="radio" name="pagamento" onChange={() => setPagamento('maquina')} /> Máquina móvel
          </label>
          <label className={styles.label}>
            <input className={styles.input} type="radio" name="pagamento" onChange={() => setPagamento('dinheiro')} /> Dinheiro
          </label>
        </div>

        <h3 className={styles.h3}>Endereço de entrega</h3>
        <div className={styles.bloco}>
          <p className={styles.p}><span className={styles.fixo}>Rua:</span> <span></span></p>
          <p className={styles.p}><span className={styles.fixo}>Número da casa:</span> <span></span></p>
          <p className={styles.p}><span className={styles.fixo}>CEP:</span> <span></span></p>
          <p className={styles.p}><span className={styles.fixo}>Bairro:</span> <span></span></p>
          <p className={styles.p}><span className={styles.fixo}>Complemento:</span> <span></span></p>
        </div>

        <h3 className={styles.resumotitle}>Resumo do pedido</h3>
        <div className={styles.blocoresumo}>
          <p className={styles.p}>
            <span className={styles.fixo}>Quantidade:</span> <span>{resumo ? resumo.quantidade : 'Carregando...'}</span>
          </p>
          <p className={styles.p}>
            <span className={styles.fixo}>Taxa de serviço:</span> <span>R$ {resumo ? resumo.taxaServico.toFixed(2) : 'Carregando...'}</span>
          </p>
          <p className={styles.p}>
            <span className={styles.fixo}>Taxa de entrega:</span> <span>R$ {resumo ? resumo.taxaEntrega.toFixed(2) : 'Carregando...'}</span>
          </p>
          <p className={styles.p}>
            <span className={styles.fixo}>Total:</span> <span>R$ {resumo ? resumo.total.toFixed(2) : 'Carregando...'}</span>
          </p>
        </div>

        <div className={styles.botoes}>
          <button className={styles.button} onClick={handleLimparPedido}>
            <span className={styles.link}>Limpar Pedido</span>
          </button>
          <button className={styles.button}>
            <Link className={styles.link} href="/pedido">Voltar</Link>
          </button>
          <button className={styles.button}>
            <Link className={styles.link} href="/vendaCupcake">Fazer pedido</Link>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;