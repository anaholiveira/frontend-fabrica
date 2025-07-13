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
    console.log('Buscando relatório:', url);

    try {
      const res = await fetch(url);

      if (!res.ok) {
        const textoErro = await res.text();
        setMensagem(textoErro || 'Erro ao buscar relatório.');
        return;
      }

      const data = await res.json();
      console.log('Dados recebidos da API:', data);

      if (!data || (Array.isArray(data) && data.length === 0)) {
        setMensagem('Nenhum pedido foi encontrado no intervalo informado.');
        return;
      }

      const pedidosFiltrados = data.filter(
        (pedido) =>
          pedido.status === 'finalizado' &&
          (recheioSelecionado ? pedido.recheio === recheioSelecionado : true)
      );

      if (pedidosFiltrados.length === 0) {
        setMensagem('Nenhum pedido finalizado encontrado com o recheio selecionado.');
        setPedidos([]);
      } else {
        setPedidos(pedidosFiltrados);
      }
    } catch (error) {
      console.error('Erro ao conectar com a API ou processar dados:', error);
      setMensagem('Erro ao conectar com a API ou processar dados.');
    }
  };

  const calcularTotais = () => {
    const totalPedidos = pedidos.length;
    const valorTotal = pedidos.reduce(
      (total, pedido) => total + Number(pedido.valor_total || 0),
      0
    );
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
                <a className={styles.bott} href="/area">
                  Voltar
                </a>
              </button>
            </div>
          </form>

          {mensagem && (
            <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
              {mensagem}
            </p>
          )}

          {pedidos.length > 0 && (
            <>
              <div className={styles.tabelaWrapper}>
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
                    {pedidos.map((pedido, index) => (
                      <tr key={`${pedido.id_pedido}-${index}`}>
                        <td>{pedido.id_pedido}</td>
                        <td>{pedido.data_criacao}</td>
                        <td>{pedido.nome_completo}</td>
                        <td>R$ {Number(pedido.valor_total).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p
                style={{
                  textAlign: 'center',
                  marginTop: '10px',
                  fontFamily: 'Coiny, system-ui',
                  color: 'var(--cor4)',
                }}
              >
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