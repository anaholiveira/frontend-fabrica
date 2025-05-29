'use client'
import React, { useState } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Checkout = () => {
  const [pagamento, setPagamento] = useState('');

  const handleLimparCarrinho = async () => {
    await fetch('/api/limpar-carrinho', { method: 'POST' });
    alert('Carrinho limpo!');
  };

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
        <p className={styles.p}>Rua:</p>
        <p className={styles.p}>Número da casa:</p>
        <p className={styles.p}>CEP:</p>
        <p className={styles.p}>Bairro:</p>
        <p className={styles.p}>Complemento:</p>
      </div>

      <h3 className={styles.resumotitle}>Resumo do pedido</h3>
      <div className={styles.blocoresumo}>
        <p className={styles.p}>Quantidade:</p>
        <p className={styles.p}>Taxa de serviço:</p>
        <p className={styles.p}>Taxa de entrega:</p>
        <p className={styles.p}>Total:</p>
      </div>

      <div className={styles.botoes}>
        <button className={styles.button} onClick={handleLimparCarrinho}>
          <Link className={styles.link} href="#">Limpar Carrinho</Link>
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