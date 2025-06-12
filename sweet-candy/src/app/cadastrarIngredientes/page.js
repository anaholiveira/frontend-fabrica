"use client";
import React, { useEffect, useState } from "react";
import styles from './page.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Ingredientes = () => {
  const [dados, setDados] = useState({
    tamanho: [],
    recheio: [],
    cobertura: [],
    cor_cobertura: [],
  });

  const [novos, setNovos] = useState({
    tamanho: { nome: '', valor: '' },
    recheio: { nome: '', valor: '' },
    cobertura: { nome: '', valor: '' },
    cor_cobertura: { nome: '', valor: '' },
  });

  const fetchDados = async () => {
    const tipos = ['tamanho', 'recheio', 'cobertura', 'cor_cobertura'];
    const novoEstado = {};
    for (const tipo of tipos) {
      const res = await fetch(`https://apisweetcandy.dev.vilhena.ifro.edu.br/ingredientes/${tipo}`);
      const json = await res.json();
      novoEstado[tipo] = json;
    }
    setDados(novoEstado);
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const adicionarIngrediente = async (tipo) => {
    const { nome, valor } = novos[tipo];
    if (!nome || !valor) return;

    await fetch('https://apisweetcandy.dev.vilhena.ifro.edu.br/ingredientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        tipo,
        valor: parseFloat(valor),
      })
    });

    setNovos({ ...novos, [tipo]: { nome: '', valor: '' } });
    fetchDados();
  };

  const excluirIngrediente = async (id) => {
    await fetch(`https://apisweetcandy.dev.vilhena.ifro.edu.br/ingredientes/${id}`, {
      method: 'DELETE'
    });
    fetchDados();
  };

  const renderCard = (tipo, titulo) => (
    <div className={styles.card}>
      <h2 className={styles.h2}>{titulo}</h2>
      <ul className={styles.ul}>
        {dados[tipo].map((item, index) => (
          <li className={styles.li} key={item.id_ingrediente}>
            <span className={styles.span}>{index + 1}</span> {item.nome}: R$ {Number(item.valor).toFixed(2)}
            <button className={styles.button} onClick={() => excluirIngrediente(item.id_ingrediente)}>excluir</button>
          </li>
        ))}
      </ul>
      <p>Adicionar Ingredientes</p>
      <input
        className={styles.input}
        placeholder="Digite aqui..."
        value={novos[tipo].nome}
        onChange={(e) => setNovos({ ...novos, [tipo]: { ...novos[tipo], nome: e.target.value } })}
      />
      <input
        className={styles.input}
        placeholder="Valor (ex: 2.00)"
        type="number"
        step="0.01"
        value={novos[tipo].valor}
        onChange={(e) => setNovos({ ...novos, [tipo]: { ...novos[tipo], valor: e.target.value } })}
      />
      <button className={styles.button} onClick={() => adicionarIngrediente(tipo)}>Confirmar</button>
    </div>
  );

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.h1}>Cadastrar Ingredientes</h1>
        <div className={styles.boxes}>
          {renderCard('tamanho', 'Tamanhos')}
          {renderCard('recheio', 'Recheios')}
          {renderCard('cobertura', 'Coberturas')}
          {renderCard('cor_cobertura', 'Cor da Cobertura')}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Ingredientes;