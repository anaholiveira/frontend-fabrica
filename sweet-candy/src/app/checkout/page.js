'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const Checkout = () => {
  const router = useRouter();
  const [pagamento, setPagamento] = useState('');
  const [resumo, setResumo] = useState(null);
  const [carregandoCep, setCarregandoCep] = useState(false);

  const [endereco, setEndereco] = useState({
    rua: '',
    numero: '',
    cep: '',
    bairro: '',
    complemento: '',
  });

  const fetchCepData = async (cepNumerico) => {
    try {
      setCarregandoCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
      const data = await response.json();
      if (data.erro) {
        alert('CEP não encontrado. Verifique os dados e tente novamente.');
        return;
      }
      setEndereco((prev) => ({
        ...prev,
        rua: data.logradouro || '',
        bairro: data.bairro || '',
      }));
    } catch {
      alert('Não foi possível buscar o CEP. Tente novamente mais tarde.');
    } finally {
      setCarregandoCep(false);
    }
  };

  const fetchResumo = async (clienteId) => {
    if (!clienteId) {
      alert('Cliente não identificado. Faça login novamente.');
      return;
    }

    try {
      setResumo(null);
      const res = await fetch(`https://apisweetcandy.dev.vilhena.ifro.edu.br/resumo/${clienteId}`);
      if (!res.ok) {
        const erroJSON = await res.json().catch(() => ({}));
        throw new Error(erroJSON.erro || 'Erro ao buscar resumo');
      }
      const data = await res.json();
      setResumo(data);
    } catch (error) {
      setResumo(null);
      alert(`Erro ao carregar o resumo do pedido: ${error.message}`);
    }
  };

  const handleEnderecoChange = (e) => {
    const { name, value } = e.target;
    let novoValor = value;

    if (name === 'numero') novoValor = value.replace(/\D/g, '');
    if (name === 'cep') {
      novoValor = value.replace(/\D/g, '').slice(0, 8).replace(/^(\d{5})(\d{0,3})$/, '$1-$2');
      const cepNums = novoValor.replace(/\D/g, '');
      if (cepNums.length === 8) fetchCepData(cepNums);
    }

    setEndereco((prev) => ({ ...prev, [name]: novoValor }));
  };

  const handleLimparPedido = async () => {
    const clienteId = localStorage.getItem('clienteId');
    if (!clienteId) return alert('Não foi possível identificar o cliente. Faça login novamente.');

    try {
      const res = await fetch(
        `https://apisweetcandy.dev.vilhena.ifro.edu.br/pedidos/aguardando/${clienteId}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (res.ok) {
        alert('Pedidos cancelados!');
        router.push('/pedido');
      } else {
        alert(data.erro || 'Erro ao cancelar pedidos.');
      }
    } catch {
      alert('Erro ao conectar com a API. Tente novamente mais tarde.');
    }
  };

  const handleFazerPedido = async () => {
    if (!resumo || resumo.quantidade === 0)
      return alert('Adicione pelo menos um cupcake antes de prosseguir com o pedido.');

    if (!pagamento) return alert('Selecione uma forma de pagamento antes de finalizar.');

    const { rua, numero, cep, bairro } = endereco;
    if (!rua || !numero || !cep || !bairro)
      return alert('Preencha todos os campos obrigatórios do endereço.');

    const clienteId = localStorage.getItem('clienteId');
    if (!clienteId) return alert('Não foi possível identificar o cliente. Faça login novamente.');

    try {
      const resEndereco = await fetch('https://apisweetcandy.dev.vilhena.ifro.edu.br/endereco', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_cliente: clienteId, ...endereco }),
      });
      const dataEndereco = await resEndereco.json();
      if (!resEndereco.ok) return alert(dataEndereco.erro || 'Erro ao salvar o endereço.');
    } catch {
      return alert('Erro ao conectar-se à API de endereço.');
    }

    const formaPagamentoConvertida = pagamento === 'maquina' ? 'cartao' : pagamento;

    const payload = {
      id_cliente: parseInt(clienteId),
      forma_pagamento: formaPagamentoConvertida,
      quantidade: Number(resumo.quantidade),
      valor_total: Number(resumo.total),
      taxaServico: Number(resumo.taxaServico),
      taxaEntrega: Number(resumo.taxaEntrega),
    };

    try {
      const response = await fetch('https://apisweetcandy.dev.vilhena.ifro.edu.br/resumo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        return alert(data.erro || 'Erro ao finalizar o pedido.');
      }

      alert('Pedido feito com sucesso!');

      setPagamento('');
      setEndereco({ rua: '', numero: '', cep: '', bairro: '', complemento: '' });
      setResumo(null);

      router.push('/vendaCupcake');
    } catch {
      alert('Erro ao conectar com a API de pedido.');
    }
  };

  React.useEffect(() => {
    const clienteId = localStorage.getItem('clienteId');
    fetchResumo(clienteId);
  }, []);

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.h1}>Checkout</h1>

        <h2 className={styles.h2}>Formas de Pagamento</h2>
        <div className={styles.pagamentos}>
          {['pix', 'maquina', 'dinheiro'].map((tipo) => (
            <label key={tipo} className={styles.label}>
              <input
                type="radio"
                name="pagamento"
                className={styles.input}
                checked={pagamento === tipo}
                onChange={() => setPagamento(tipo)}
              />
              {tipo === 'pix' ? 'Pix' : tipo === 'maquina' ? 'Máquina móvel' : 'Dinheiro'}
            </label>
          ))}
        </div>

        <h3 className={styles.h3}>Endereço de entrega</h3>
        <div className={styles.bloco}>
          <p className={`${styles.p} ${styles.fullRow}`}>
            <span className={styles.fixo}>Rua:</span>
            <input readOnly name="rua" value={endereco.rua} className={styles.inputTexto} placeholder="Rua" />
          </p>

          <p className={styles.p}>
            <span className={styles.fixo}>Número:</span>
            <input
              name="numero"
              inputMode="numeric"
              value={endereco.numero}
              onChange={handleEnderecoChange}
              className={styles.inputTexto}
              placeholder="Número"
            />
          </p>

          <p className={styles.p}>
            <span className={styles.fixo}>CEP:</span>
            <input
              name="cep"
              value={endereco.cep}
              onChange={handleEnderecoChange}
              className={styles.inputTexto}
              placeholder="CEP (ex: 12345-678)"
            />
            {carregandoCep && <span className={styles.loading}>Buscando CEP…</span>}
          </p>

          <p className={styles.p}>
            <span className={styles.fixo}>Bairro:</span>
            <input readOnly name="bairro" value={endereco.bairro} className={styles.inputTexto} placeholder="Bairro" />
          </p>

          <p className={styles.p}>
            <span className={styles.fixo}>Complemento:</span>
            <input
              name="complemento"
              value={endereco.complemento}
              onChange={handleEnderecoChange}
              className={styles.inputTexto}
              placeholder="Complemento (opcional)"
            />
          </p>
        </div>

        <h3 className={styles.resumotitle}>Resumo do pedido</h3>
        <div className={styles.blocoresumo}>
          <p className={styles.p}>
            <span className={styles.fixo}>Quantidade:</span>{' '}
            <span>{resumo ? resumo.quantidade : 'Carregando…'}</span>
          </p>
          <p className={styles.p}>
            <span className={styles.fixo}>Taxa de serviço:</span>{' '}
            <span>{resumo ? `R$ ${resumo.taxaServico.toFixed(2)}` : 'Carregando…'}</span>
          </p>
          <p className={styles.p}>
            <span className={styles.fixo}>Taxa de entrega:</span>{' '}
            <span>{resumo ? `R$ ${resumo.taxaEntrega.toFixed(2)}` : 'Carregando…'}</span>
          </p>
          <p className={styles.p}>
            <span className={styles.fixo}>Total:</span>{' '}
            <span>{resumo ? `R$ ${resumo.total.toFixed(2)}` : 'Carregando…'}</span>
          </p>
        </div>

        <div className={styles.botoes}>
          <button type="button" className={styles.button} onClick={handleLimparPedido}>
            Limpar pedido
          </button>
          <button type="button" className={styles.button} onClick={handleFazerPedido}>
            Fazer pedido
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;