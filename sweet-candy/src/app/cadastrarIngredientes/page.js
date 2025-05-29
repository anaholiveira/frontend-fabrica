"use client";
import React, { Component } from "react";
import styles from './page.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
   
class Ingredientes extends Component {
  render() {
    return (
        <div>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.h1}>Cadastrar Ingredientes</h1>
                <div className={styles.boxes}>
                <div className={styles.card}>
                    <h2 className={styles.h2}>Tamanhos</h2>
                    <ul className={styles.ul}>
                    <li className={styles.li}><span className={styles.span}>1</span> Pequeno(P): R$ 3,00 <button className={styles.button}>excluir</button></li>
                    <li className={styles.li}><span className={styles.span}>2</span> Médio(M): R$ 5,00 <button className={styles.button}>excluir</button></li>
                    <li className={styles.li}><span className={styles.span}>3</span> Grande(G): R$ 8,00 <button className={styles.button}>excluir</button></li>
                    </ul>
                    <p>Adicionar Ingredientes</p>
                    <input className={styles.input} placeholder="Digite aqui..." />
                    <button className={styles.button}>Confirmar</button>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.h2}>Recheios</h2>
                    <ul className={styles.ul}>
                    <li className={styles.li}><span className={styles.span}>1</span> Brigadeiro: R$ 2,00 <button className={styles.button}>excluir</button></li>
                    <li className={styles.li}><span className={styles.span}>2</span> Doce de Leite: R$ 2,00 <button className={styles.button}>excluir</button></li>
                    <li className={styles.li}><span className={styles.span}>3</span> Leite Ninho: R$ 2,00 <button className={styles.button}>excluir</button></li>
                    <li className={styles.li}><span className={styles.span}>4</span> Nutella: R$ 3,00 <button className={styles.button}>excluir</button></li>
                    </ul>
                    <p>Adicionar Ingredientes</p>
                    <input className={styles.input} placeholder="Digite aqui..." />
                    <button className={styles.button}>Confirmar</button>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.h2}>Coberturas</h2>
                    <ul className={styles.ul}>
                    <li className={styles.li}><span className={styles.span}>1</span> Glacê: R$2,00 <button className={styles.button}>excluir</button></li>
                    <li className={styles.li}><span className={styles.span}>2</span> Chantilly: R$2,00 <button className={styles.button}>excluir</button></li>
                    <li className={styles.li}><span className={styles.span}>3</span> Merengue: R$2,00 <button className={styles.button}>excluir</button></li>
                    </ul>
                    <p>Adicionar Ingredientes</p>
                    <input className={styles.input} placeholder="Digite aqui..." />
                    <button className={styles.button}>Confirmar</button>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.h2}>Cor da Cobertura</h2>
                    <ul className={styles.ul}>
                    <li className={styles.li}><span className={styles.span}>1</span> Roxo: R$1,00 <button className={styles.button}>excluir</button></li>
                    <li className={styles.li}><span className={styles.span}>2</span> Rosa: R$1,00 <button className={styles.button}>excluir</button></li>
                    <li className={styles.li}><span className={styles.span}>3</span> Lilás: R$1,00 <button className={styles.button}>excluir</button></li>
                    <li className={styles.li}><span className={styles.span}>4</span> Azul: R$1,00 <button className={styles.button}>excluir</button></li>
                    <li className={styles.li}><span className={styles.span}>5</span> Azul claro: R$1,00 <button className={styles.button}>excluir</button></li>
                    <li className={styles.li}><span className={styles.span}>6</span> Verde menta: R$1,00 <button className={styles.button}>excluir</button></li>
                    <li className={styles.li}><span className={styles.span}>7</span> Branco(padrão): R$0,00 <button className={styles.button}>excluir</button></li>
                    </ul>
                    <p>Adicionar Ingredientes</p>
                    <input className={styles.input} placeholder="Digite aqui..." />
                    <button className={styles.button}>Confirmar</button>
                </div>
                </div>
            </div>
            <Footer />
        </div>
      
    );
  }
}

export default Ingredientes;