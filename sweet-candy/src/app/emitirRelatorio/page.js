'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

export default function Relatorio() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [ingredientes, setIngredientes] = useState([]);
  const [recheioSelecionado, setRecheioSelecionado] = useState('');

  useEffect(() => {
    const buscarIngredientes = async () => {
      try {
        const res = await fetch('https://apisweetcandy.dev.vilhena.ifro.edu.br/buscarIngredientes');
        const data = await res.json();
        const recheios = data.filter((item) => item.tipo === 'recheio');
        setIngredientes(recheios);
      } catch (error) {
        console.error('Erro ao buscar ingredientes:', error);
      }
    };

    buscarIngredientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem('');
    setPedidos([]);

    if (!dataInicio || !dataFim) {
      setMensagem('As datas de início e fim são obrigatórias.');
      return;
    }

    const url = `https://apisweetcandy.dev.vilhena.ifro.edu.br/relatorio?dataInicio=${dataInicio}&dataFim=${dataFim}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        setMensagem(data.mensagem || 'Erro ao buscar relatório.');
      } else if (Array.isArray(data) && data.length === 0) {
        setMensagem('Nenhum pedido foi encontrado no intervalo informado.');
      } else {
        const pedidosFiltrados = recheioSelecionado
          ? data.filter(pedido => pedido.ingredientes.some(ing => ing.nome === recheioSelecionado))
          : data;
        setPedidos(pedidosFiltrados);
      }
    } catch (error) {
      setMensagem('Erro ao conectar com a API.');
    }
  };

  const calcularTotais = () => {
    const totalPedidos = pedidos.length;
    const valorTotal = pedidos.reduce((total, pedido) => total + pedido.total, 0);
    return { totalPedidos, valorTotal };
  };

  const { totalPedidos, valorTotal } = calcularTotais();

  return (
    <main>
      <Header />
      <div className={styles.fundo}>
        <div className={styles.data}>
          <h2 className={styles.h2}>Emitir relatório</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.venda}>
              <label className={styles.label} htmlFor="data-inicio">
                Data de venda
                <input
                  className={styles.input}
                  type="date"
                  id="data-inicio"
                  name="data-inicio"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </label>
              <label htmlFor="data-fim" className={styles.label}>
                à
                <input
                  className={styles.input}
                  type="date"
                  id="data-fim"
                  name="data-fim"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </label>
              <label className={styles.label}>
                Recheio
                <select
                  className={`${styles.input} ${styles.pesquisa}`}
                  value={recheioSelecionado}
                  onChange={(e) => setRecheioSelecionado(e.target.value)}
                >
                  <option value="">Todos</option>
                  {ingredientes.map((ing) => (
                    <option key={ing.id_ingrediente} value={ing.nome}>
                      {ing.nome}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className={styles.bots}>
              <button className={styles.botao} type="submit">
                Confirmar
              </button>
              <button className={styles.botao} type="button">
                <a className={styles.bott} href="/area">Voltar</a>
              </button>
            </div>
          </form>

          {mensagem && (
            <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{mensagem}</p>
          )}

          {pedidos.length > 0 && (
            <>
              <table className={styles.tabela}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Data</th>
                    <th>Cliente</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>{pedido.id}</td>
                      <td>{pedido.data}</td>
                      <td>{pedido.cliente}</td>
                      <td>R$ {pedido.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ textAlign: 'center', marginTop: '10px', fontFamily: 'Coiny, system-ui', color: 'var(--cor4)' }}>
                Total de pedidos: {totalPedidos} | Valor total: R$ {valorTotal.toFixed(2)}
              </p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}