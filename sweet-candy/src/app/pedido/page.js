'use client';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import Footer from '@/components/Footer';
import HeaderPedido from '@/components/HeaderPedido';
import styles from './page.module.css';

export default function Pedido() {
  const router = useRouter();
  const [clienteId, setClienteId] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [pedido, setPedido] = useState({
    tamanho: "",
    recheio: "",
    cobertura: "",
    corCobertura: ""
  });
  const [ingredientesAPI, setIngredientesAPI] = useState({
    tamanho: [],
    recheio: [],
    cobertura: [],
    cor_cobertura: []
  });
  const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    const idSalvo = localStorage.getItem('clienteId');
    if (idSalvo) {
      setClienteId(Number(idSalvo));
    } else {
      alert("Você precisa estar logado para continuar. Faça login e tente novamente.");
    }
  }, []);

  useEffect(() => {
    fetch('https://apisweetcandy.dev.vilhena.ifro.edu.br/buscarIngredientes')
      .then(res => res.json())
      .then(data => {
        const agrupados = { tamanho: [], recheio: [], cobertura: [], cor_cobertura: [] };
        data.forEach(item => {
          agrupados[item.tipo]?.push(item);
        });
        setIngredientesAPI(agrupados);
      })
      .catch(err => console.error('Erro ao buscar ingredientes:', err));
  }, []);

  const buscarCarrinho = async () => {
    try {
      if (!clienteId) return;
      const res = await fetch(`https://apisweetcandy.dev.vilhena.ifro.edu.br/carrinho/${clienteId}`);
      if (!res.ok) throw new Error("Erro ao buscar os itens do carrinho. Tente novamente.");
      const dados = await res.json();
      setCarrinho(dados);
    } catch (error) {
      alert("Não foi possível buscar o carrinho.\n\nDetalhes: " + error.message);
      setCarrinho([]);
    }
  };

  useEffect(() => {
    if (mostrarCarrinho) buscarCarrinho();
  }, [mostrarCarrinho, clienteId]);

  const reset = () => {
    document.querySelectorAll("select").forEach(select => select.value = "");
    setPedido({ tamanho: "", recheio: "", cobertura: "", corCobertura: "" });
    setQuantidade(1);
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPedido(prev => ({ ...prev, [name]: value }));
  };

  const buscarNomeIngrediente = (tipo, id) => {
    const lista = ingredientesAPI[tipo === 'corCobertura' ? 'cor_cobertura' : tipo];
    const item = lista.find(i => String(i.id_ingrediente) === String(id));
    return item ? item.nome : "";
  };

  const buscarValorIngrediente = (tipo, id) => {
    const lista = ingredientesAPI[tipo === 'corCobertura' ? 'cor_cobertura' : tipo];
    const item = lista.find(i => String(i.id_ingrediente) === String(id));
    return item ? parseFloat(item.valor) : 0;
  };

  const calcularPrecoTotal = () => {
    const totalIngredientes =
      buscarValorIngrediente("tamanho", pedido.tamanho) +
      buscarValorIngrediente("recheio", pedido.recheio) +
      buscarValorIngrediente("cobertura", pedido.cobertura) +
      buscarValorIngrediente("corCobertura", pedido.corCobertura);
    return (totalIngredientes * quantidade).toFixed(2);
  };

  const precoTotal = calcularPrecoTotal();

  const adicionarAoCarrinho = async (event) => {
    event.preventDefault();
    if (!clienteId) {
      alert("Você precisa estar logado para adicionar ao carrinho.");
      return;
    }

    if (pedido.tamanho === "" || pedido.recheio === "" || pedido.cobertura === "" || pedido.corCobertura === "") {
      alert("Por favor, selecione todas as opções do cupcake antes de adicionar ao carrinho.");
      return;
    }

    const ingredientes = [
      Number(pedido.tamanho),
      Number(pedido.recheio),
      Number(pedido.cobertura),
      Number(pedido.corCobertura),
    ];

    const dadosParaAPI = {
      id_cliente: clienteId,
      ingredientes,
      quantidade,
    };

    try {
      const res = await fetch("https://apisweetcandy.dev.vilhena.ifro.edu.br/adicionarAoCarrinho", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaAPI),
      });

      const resposta = await res.json();
      if (!res.ok) {
        throw new Error(resposta.mensagem || "Não foi possível adicionar ao carrinho.");
      }

      alert(resposta.mensagem);
      reset();
      buscarCarrinho();

    } catch (error) {
      alert("Erro ao adicionar ao carrinho. Tente novamente.\n\nDetalhes: " + error.message);
    }
  };

  const finalizarPedido = async () => {
    if (!clienteId) {
      alert("Você precisa estar logado para finalizar o pedido.");
      return;
    }

    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio. Adicione pelo menos um cupcake para finalizar o pedido.");
      return;
    }

    setMostrarConfirmacao(true);
  };

  const confirmarFinalizacao = async () => {
    try {
      const res = await fetch("https://apisweetcandy.dev.vilhena.ifro.edu.br/finalizarPedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cliente: clienteId }),
      });

      const resposta = await res.json();
      if (!res.ok) {
        throw new Error(resposta.mensagem || "Não foi possível finalizar o pedido.");
      }

      alert(resposta.mensagem);
      reset();
      setMostrarCarrinho(false);
      setMostrarConfirmacao(false);
      buscarCarrinho();
      router.push("/checkout");

    } catch (error) {
      alert("Erro ao finalizar o pedido. Verifique sua conexão ou tente novamente mais tarde.\n\nDetalhes: " + error.message);
    }
  };

  const labels = {
    tamanho: "Tamanho",
    recheio: "Recheio",
    cobertura: "Cobertura",
    corCobertura: "Cor da Cobertura"
  };

  return (
    <div>
      <HeaderPedido />
      <div className={styles.telaFundo}>
        <Image
          className={styles.carrinho}
          src='/images/carrinho.png'
          alt='Carrinho'
          width={32}
          height={32}
          onClick={() => setMostrarCarrinho(!mostrarCarrinho)}
        />

        {mostrarCarrinho && (
          <>
            <div className={styles.overlay} onClick={() => setMostrarCarrinho(false)}></div>
            <div className={styles.detalhesCarrinho}>
              <h2 className={styles.h2}>Carrinho</h2>
              <div className={styles.detalhesDoCupcake}>
                {carrinho.length === 0 && <p className={styles.carrinhoVazio}>Seu carrinho está vazio.</p>}
                {carrinho.map(item => (
                  <div key={item.id_pedido_carrinho} className={styles.itemCarrinho}>
                    <p><span className={styles.tituloCarrinho}>ID Pedido:</span> {item.id_pedido_carrinho}</p>
                    <p><span className={styles.tituloCarrinho}>Ingredientes:</span> {item.ingredientes.split(',').join(', ')}</p>
                    <p><span className={styles.tituloCarrinho}>Quantidade:</span> {item.quantidade}</p>
                    <p><span className={styles.tituloCarrinho}>Valor total:</span> R$ {Number(item.valor_total).toFixed(2)}</p>
                    <button
                      className={styles.botaoRemover}
                      onClick={async () => {
                        try {
                          const res = await fetch(`https://apisweetcandy.dev.vilhena.ifro.edu.br/excluirPedidoCarrinho/${item.id_pedido_carrinho}`, {
                            method: 'DELETE'
                          });
                          if (!res.ok) throw new Error("Erro ao remover item.");
                          const novoCarrinho = carrinho.filter(p => p.id_pedido_carrinho !== item.id_pedido_carrinho);
                          setCarrinho(novoCarrinho);
                        } catch (err) {
                          alert("Erro ao remover pedido do carrinho: " + err.message);
                        }
                      }}
                    >Remover do carrinho</button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {mostrarConfirmacao && (
          <>
            <div className={styles.overlay}></div>
            <div className={styles.confirmacaoFixa}>
              <h2 className={styles.h2}>Confirmar pedido</h2>
              <div className={styles.detalhesDoCupcake}>
                {carrinho.map(item => (
                  <div key={item.id_pedido_carrinho} className={styles.itemCarrinho}>
                    <p><span className={styles.tituloCarrinho}>ID Pedido:</span> {item.id_pedido_carrinho}</p>
                    <p><span className={styles.tituloCarrinho}>Ingredientes:</span> {item.ingredientes.split(',').join(', ')}</p>
                    <p><span className={styles.tituloCarrinho}>Quantidade:</span> {item.quantidade}</p>
                    <p><span className={styles.tituloCarrinho}>Valor total:</span> R$ {Number(item.valor_total).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className={styles.botoesConfirmacao}>
                <button className={styles.botaoMenor} onClick={() => setMostrarConfirmacao(false)}>Cancelar</button>
                <button className={styles.botaoMenor} onClick={confirmarFinalizacao}>Confirmar</button>
              </div>
            </div>
          </>
        )}

        <h1 className={styles.h1}>Faça seu pedido</h1>
        <p className={styles.pIntroducao}>Monte seu cupcake fazendo uma escolha perfeita!</p>

        <div className={styles.mainContainer}>
          {Object.keys(pedido).map((item, index) => (
            <div key={index} className={styles.selectContainer}>
              <label className={styles.selectLabel} htmlFor={`select${item}`}>{labels[item]}</label>
              <div className={styles.selectBody}>
                <select className={styles.select}
                  name={item}
                  id={`select${item}`}
                  onChange={handleSelectChange}
                >
                  <option value="">Escolha uma opção</option>
                  {ingredientesAPI[item === 'corCobertura' ? 'cor_cobertura' : item].map(opt => (
                    <option key={opt.id_ingrediente} value={opt.id_ingrediente}>
                      {opt.nome} R$ {Number(opt.valor).toFixed(2)}
                    </option>
                  ))}
                </select>
                <div className={styles.selectIcon}>
                  <Image className={styles.img} src="/images/iconseta.png" alt="icon seta" width={18} height={18} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.resumoContainer}>
          <div className={styles.resumoPedido}>
            <h2 className={styles.resumoTitulo}>Resumo do Pedido</h2>
            {Object.keys(pedido).map((item, index) => (
              <p key={index}>
                <strong>{labels[item]}:</strong>{" "}
                {pedido[item] ? buscarNomeIngrediente(item, pedido[item]) : ""}
              </p>
            ))}
          </div>
          <div className={styles.quantidadeContainer}>
            <label className={styles.quantidadeLabel} htmlFor="quantidade">Quantidade</label>
            <input
              type="number"
              id="quantidade"
              min="1"
              max="300"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className={styles.quantidadeInput}
            />
            <p className={styles.precoTotal}>Total: R$ {precoTotal}</p>
          </div>
        </div>

        <div className={styles.buttons}>
          <button className={styles.button} type="button" onClick={reset}>Cancelar opções</button>
          <button className={styles.button} type="button" onClick={adicionarAoCarrinho}>Adicionar ao carrinho</button>
          <button className={styles.button} type="button" onClick={finalizarPedido}>Finalizar pedido</button>
        </div>
      </div>

      <Footer />
    </div>
  );
}