"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CadastrarFeedback() {
  const [mensagem, setMensagem] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [estrelasSelecionadas, setEstrelasSelecionadas] = useState([]);

  function msg(event) {
    const arquivos = Array.from(event.target.files);
    const arquivosRestantes = 3 - previews.length;

    if (arquivosRestantes <= 0) {
      alert("Você só pode adicionar até 3 imagens.");
      return;
    }

    const selecionadas = arquivos.slice(0, arquivosRestantes);
    const novasPreviews = selecionadas.map((arquivo) =>
      URL.createObjectURL(arquivo)
    );

    setPreviews((prev) => [...prev, ...novasPreviews]);
    setMensagem(true);
    setTimeout(() => setMensagem(false), 3000);
  }

  function removerPreview(index) {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  function toggleEstrela(num) {
    setEstrelasSelecionadas((prev) => {
      if (prev.length === 1 && prev[0] === num) {
        return [];
      }
      return Array.from({ length: num }, (_, i) => i + 1);
    });
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1 className={styles.h1}>Comentar</h1>

        <div className={styles.rating}>
          {[5, 4, 3, 2, 1].map((num) => (
            <div key={num} style={{ display: "inline-block" }}>
              <input
                className={styles.input}
                type="checkbox"
                id={`star${num}`}
                checked={estrelasSelecionadas.includes(num)}
                onChange={() => toggleEstrela(num)}
              />
              <label className={styles.label} htmlFor={`star${num}`}>
                ★
              </label>
            </div>
          ))}
        </div>

        <label className={styles.label} htmlFor="feedback">
          <input
            className={styles.input}
            type="text"
            placeholder="Digite seu feedback..."
          />
        </label>

        <label className={styles.label} htmlFor="image" id="file" tabIndex="0">
          <span className={styles.filee}> Carregue fotos 1/3</span>
          <input
            className={`${styles.input} ${styles.image}`}
            type="file"
            id="image"
            accept="image/*"
            multiple
            onChange={msg}
          />
          <span>
            <img
              className={styles.fotoinput}
              src="/images/importimage.png"
              alt="imagem"
            />
          </span>
        </label>

        {previews.length > 0 && (
          <div className={styles.containerPrevia}>
            {previews.map((src, index) => (
              <div
                key={index}
                style={{ position: "relative", display: "inline-block" }}
              >
                <img
                  src={src}
                  alt={`prévia ${index + 1}`}
                  className={styles.imagemPrevia}
                />
                <button
                  type="button"
                  onClick={() => removerPreview(index)}
                  aria-label="Remover imagem"
                  className={styles.botaoRemoverImagem}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {mensagem && (
          <div className={styles.aviso}>Imagem anexada com sucesso! 𐙚</div>
        )}

        <div className={styles.buttons}>
          <Link href="/vendaCupcake">
            <button className={styles.button} id="back">
              Voltar
            </button>
          </Link>

          <Link href="/pedido">
            <button className={styles.button} id="confirm">
              Confirmar
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}