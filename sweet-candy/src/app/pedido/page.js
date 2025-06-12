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
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    const idSalvo = localStorage.getItem('clienteId');
    if (idSalvo) {
      setClienteId(Number(idSalvo));
    } else {
      alert("Erro: cliente não encontrado. Faça login novamente.");
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
      if (!res.ok) throw new Error("Erro ao buscar o carrinho");
      const dados = await res.json();
      setCarrinho(dados);
    } catch (error) {
      alert(error.message);
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
      alert("Erro: clienteId não disponível.");
      return;
    }
    if (pedido.tamanho === "" || pedido.recheio === "" || pedido.cobertura === "" || pedido.corCobertura === "") {
      alert("Por favor, selecione todas as opções.");
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
        throw new Error(resposta.mensagem || "Erro ao adicionar ao carrinho");
      }
      alert(resposta.mensagem);
      reset();
      buscarCarrinho();

    } catch (error) {
      alert("Erro ao adicionar ao carrinho: " + error.message);
    }
  };

  const finalizarPedido = async () => {
  if (!clienteId) {
    alert("Erro: clienteId não disponível.");
    return;
  }

  try {
    if (carrinho.length > 0) {
      const res = await fetch("https://apisweetcandy.dev.vilhena.ifro.edu.br/finalizarPedido", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_cliente: clienteId }),
      });

      const resposta = await res.json();
      if (!res.ok) throw new Error(resposta.mensagem || "Erro ao finalizar pedido do carrinho");
      alert(resposta.mensagem);

    } else {
      if (
        !pedido.tamanho &&
        !pedido.recheio &&
        !pedido.cobertura &&
        !pedido.corCobertura
      ) {
        alert("Não há pedidos no carrinho nem seleção atual para finalizar.");
        return;
      }

      if (
        !pedido.tamanho ||
        !pedido.recheio ||
        !pedido.cobertura ||
        !pedido.corCobertura
      ) {
        alert("Por favor, selecione todas as opções para finalizar o pedido.");
        return;
      }

      const ingredientes = [
        Number(pedido.tamanho),
        Number(pedido.recheio),
        Number(pedido.cobertura),
        Number(pedido.corCobertura)
      ];

      const dadosParaAPI = {
        id_cliente: clienteId,
        ingredientes,
        quantidade
      };

      const res = await fetch("https://apisweetcandy.dev.vilhena.ifro.edu.br/fazerPedidoDireto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaAPI),
      });

      const resposta = await res.json();
      if (!res.ok) throw new Error(resposta.mensagem || "Erro ao fazer pedido");
      alert(resposta.mensagem);
    }

    reset();
    setMostrarCarrinho(false);
    buscarCarrinho();
    router.push("/checkout");

  } catch (error) {
    alert("Erro ao finalizar: " + error.message);
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
                {carrinho.length === 0 && <p>Seu carrinho está vazio.</p>}
                {carrinho.map(item => (
                  <div key={item.id_pedido_carrinho} className={styles.itemCarrinho}>
                    <p><span className={styles.tituloCarrinho}>ID Pedido:</span> {item.id_pedido_carrinho}</p>
                    <p><span className={styles.tituloCarrinho}>Ingredientes:</span> {item.ingredientes.split(',').join(', ')}</p>
                    <p><span className={styles.tituloCarrinho}>Quantidade:</span> {item.quantidade}</p>
                    <p><span className={styles.tituloCarrinho}>Valor total:</span> R$ {Number(item.valor_total).toFixed(2)}</p>
                  </div>
                ))}
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
                <select
                  className={styles.select}
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