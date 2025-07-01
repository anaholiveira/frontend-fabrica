'use client'
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import Link from 'next/link';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Checkout = () => {
  const [pagamento, setPagamento] = useState('');
  const [resumo, setResumo] = useState(null);

  const [endereco, setEndereco] = useState({
    rua: '',
    numero: '',
    cep: '',
    bairro: '',
    complemento: '',
  });

  async function fetchResumo(clienteId) {
    try {
      const response = await fetch(
        `https://apisweetcandy.dev.vilhena.ifro.edu.br/resumo/${clienteId}`
      );
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

    const handleEnderecoChange = (e) => {
    const { name, value } = e.target;
    let novoValor = value;

    if (name === 'numero') {
        novoValor = value.replace(/\D/g, '');
    }

    if (name === 'cep') {
        novoValor = value
        .replace(/\D/g, '')
        .slice(0, 8)
        .replace(/^(\d{5})(\d{0,3})$/, '$1-$2');
    }

    setEndereco((prev) => ({ ...prev, [name]: novoValor }));
    };

  const handleLimparPedido = async () => {
    const clienteId = localStorage.getItem('clienteId');
    if (!clienteId) {
      alert('ID do cliente não encontrado. Faça login novamente.');
      return;
    }

    try {
      const response = await fetch(
        `https://apisweetcandy.dev.vilhena.ifro.edu.br/pedidos/aguardando/${clienteId}`,
        { method: 'DELETE' }
      );
      const data = await response.json();

      if (response.ok) {
        alert(data.mensagem || 'Pedido limpo com sucesso!');
        await fetchResumo(clienteId);
      } else {
        alert('Erro ao limpar pedido: ' + (data.erro || 'Erro desconhecido'));
      }
    } catch (error) {
      alert('Erro ao conectar com a API: ' + error.message);
    }
  };

  const handleFazerPedido = async () => {
    if (!resumo || resumo.quantidade === 0) {
      alert('Você precisa montar pelo menos 1 cupcake antes de finalizar o pedido.');
      return;
    }

    if (!pagamento) {
      alert('Selecione uma forma de pagamento antes de finalizar o pedido.');
      return;
    }

    const { rua, numero, cep, bairro } = endereco;
    if (!rua || !numero || !cep || !bairro) {
      alert('Preencha todos os campos obrigatórios do endereço.');
      return;
    }

    const clienteId = localStorage.getItem('clienteId');
    if (!clienteId) {
      alert('ID do cliente não encontrado. Faça login novamente.');
      return;
    }

    try {
      const response = await fetch(
        'https://apisweetcandy.dev.vilhena.ifro.edu.br/endereco',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_cliente: clienteId,
            ...endereco,
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        alert(data.erro || 'Erro ao salvar endereço.');
        return;
      }
    } catch (error) {
      alert('Erro ao conectar com a API de endereço: ' + error.message);
      return;
    }

    window.location.href = '/vendaCupcake';
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
            <input
              className={styles.input}
              type="radio"
              name="pagamento"
              checked={pagamento === 'pix'}
              onChange={() => setPagamento('pix')}
            />
            Pix
          </label>
          <label className={styles.label}>
            <input
              className={styles.input}
              type="radio"
              name="pagamento"
              checked={pagamento === 'maquina'}
              onChange={() => setPagamento('maquina')}
            />
            Máquina móvel
          </label>
          <label className={styles.label}>
            <input
              className={styles.input}
              type="radio"
              name="pagamento"
              checked={pagamento === 'dinheiro'}
              onChange={() => setPagamento('dinheiro')}
            />
            Dinheiro
          </label>
        </div>

        <h3 className={styles.h3}>Endereço de entrega</h3>
        <div className={styles.bloco}>
          <p className={`${styles.p} ${styles.fullRow}`}>
            <span className={styles.fixo}>Rua:</span>
            <input
              type="text"
              name="rua"
              value={endereco.rua}
              onChange={handleEnderecoChange}
              className={styles.inputTexto}
            />
          </p>

          <p className={styles.p}>
            <span className={styles.fixo}>Número:</span>
            <input
              type="text"
              inputMode="numeric"
              name="numero"
              value={endereco.numero}
              onChange={handleEnderecoChange}
              className={styles.inputTexto}
            />
          </p>

          <p className={styles.p}>
            <span className={styles.fixo}>CEP:</span>
            <input
              type="text"
              inputMode="text"
              name="cep"
              value={endereco.cep}
              maxLength={9}
              onChange={handleEnderecoChange}
              className={styles.inputTexto}
            />
          </p>

          <p className={styles.p}>
            <span className={styles.fixo}>Bairro:</span>
            <input
              type="text"
              name="bairro"
              value={endereco.bairro}
              onChange={handleEnderecoChange}
              className={styles.inputTexto}
            />
          </p>

          <p className={styles.p}>
            <span className={styles.fixo}>Complemento:</span>
            <input
              type="text"
              name="complemento"
              value={endereco.complemento}
              onChange={handleEnderecoChange}
              className={styles.inputTexto}
            />
          </p>
        </div>

        <h3 className={styles.resumotitle}>Resumo do pedido</h3>
        <div className={styles.blocoresumo}>
          <p className={styles.p}>
            <span className={styles.fixo}>Quantidade:</span>{' '}
            <span>{resumo ? resumo.quantidade : 'Carregando...'}</span>
          </p>
          <p className={styles.p}>
            <span className={styles.fixo}>Taxa de serviço:</span>{' '}
            <span>
              R$ {resumo ? resumo.taxaServico.toFixed(2) : 'Carregando...'}
            </span>
          </p>
          <p className={styles.p}>
            <span className={styles.fixo}>Taxa de entrega:</span>{' '}
            <span>
              R$ {resumo ? resumo.taxaEntrega.toFixed(2) : 'Carregando...'}
            </span>
          </p>
          <p className={styles.p}>
            <span className={styles.fixo}>Total:</span>{' '}
            <span>
              R$ {resumo ? resumo.total.toFixed(2) : 'Carregando...'}
            </span>
          </p>
        </div>

        <div className={styles.botoes}>
          <button className={styles.button} onClick={handleLimparPedido}>
            <span className={styles.link}>Limpar Pedido</span>
          </button>

          <button className={styles.button} onClick={handleFazerPedido}>
            <span className={styles.link}>Fazer pedido</span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;