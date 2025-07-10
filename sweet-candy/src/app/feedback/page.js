"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function CadastrarFeedback() {
  const [mensagem, setMensagem] = useState(false);
  const [preview, setPreview] = useState(null);
  const [estrelasSelecionadas, setEstrelasSelecionadas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbacksRecentes, setFeedbacksRecentes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (mostrarModal) {
      fetchFeedbacks();
    }
  }, [mostrarModal]);

  function msg(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const novaPreview = URL.createObjectURL(arquivo);
    setPreview(novaPreview);
    setMensagem(true);
    setTimeout(() => setMensagem(false), 3000);
  }

  function removerPreview() {
    setPreview(null);
  }

  function toggleEstrela(num) {
    setEstrelasSelecionadas((prev) => {
      if (prev.length === 1 && prev[0] === num) {
        return [];
      }
      return Array.from({ length: num }, (_, i) => i + 1);
    });
  }

  async function handleSubmitFeedback() {
    if (estrelasSelecionadas.length === 0) {
      alert("Por favor, selecione uma avaliação em estrelas.");
      return;
    }

    if (!feedbackText.trim()) {
      alert("Por favor, digite seu feedback.");
      return;
    }

    let fotoBase64 = "";

    if (preview) {
      try {
        const response = await fetch(preview);
        const blob = await response.blob();
        fotoBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error("Erro ao processar a imagem:", error);
        alert("Erro ao processar a imagem. Tente novamente.");
        return;
      }
    }

    const feedbackData = {
      id_cliente: 1,
      estrelas: estrelasSelecionadas.length,
      comentario: feedbackText,
      foto: fotoBase64,
    };

    try {
      const response = await fetch(
        "https://apisweetcandy.dev.vilhena.ifro.edu.br/feedbacks",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(feedbackData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Feedback enviado com sucesso! Agradecemos sua avaliação.");
        setEstrelasSelecionadas([]);
        setFeedbackText("");
        setPreview(null);
        router.push("/pedido");
      } else {
        alert(`Erro ao enviar feedback: ${data.erro || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("Erro ao conectar com a API de envio:", error);
      alert(`Não foi possível conectar com o servidor para enviar o feedback.\nErro: ${error.message || error}`);
    }
  }

  async function fetchFeedbacks() {
    try {
      const response = await fetch(
        "https://apisweetcandy.dev.vilhena.ifro.edu.br/feedbacks"
      );
      if (!response.ok) {
        throw new Error(`Erro HTTP! Status: ${response.status}`);
      }
      const data = await response.json();
      setFeedbacksRecentes(data);
    } catch (error) {
      console.error("Erro ao buscar feedbacks:", error);
      alert("Não foi possível carregar os feedbacks recentes.");
      setFeedbacksRecentes([]);
    }
  }

function formatarDataBR(dataISO) {
  try {

    const dataUtc = new Date(dataISO);

    const formatter = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Porto_Velho",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formatter.format(dataUtc);
  } catch {
    return dataISO;
  }
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
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          />
        </label>

        <label className={styles.label} htmlFor="image" id="file" tabIndex="0">
          <span className={styles.filee}> Carregue uma foto</span>
          <input
            className={`${styles.input} ${styles.image}`}
            type="file"
            id="image"
            accept="image/*"
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

        {preview && (
          <div className={styles.containerPrevia}>
            <div className={styles.previewWrapper}>
              <img src={preview} alt="prévia" className={styles.imagemPrevia} />
              <button
                type="button"
                onClick={removerPreview}
                aria-label="Remover imagem"
                className={styles.botaoRemoverImagem}
              >
                ×
              </button>
            </div>
          </div>
        )}

        {mensagem && (
          <div className={styles.aviso}>Imagem anexada com sucesso! 𐙚</div>
        )}

        <div className={styles.buttons}>
          <button
            className={styles.button}
            id="back"
            onClick={() => router.back()}
          >
            Voltar
          </button>

          <button
            className={styles.button}
            id="confirm"
            onClick={handleSubmitFeedback}
          >
            Confirmar
          </button>

          <button
            className={styles.button}
            onClick={() => setMostrarModal(true)}
          >
            Ver Feedbacks Recentes
          </button>
        </div>
      </div>

      {mostrarModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setMostrarModal(false)} // Fecha ao clicar fora
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()} // Bloqueia fechamento ao clicar dentro
          >
            <button
              className={styles.fechar}
              onClick={() => setMostrarModal(false)}
            >
              ×
            </button>
            <h2 className={styles.h2}>Feedbacks Recentes</h2>

            {feedbacksRecentes.length > 0 ? (
              feedbacksRecentes.map((feedback) => (
                <div key={feedback.id_feedback} className={styles.feedbackItem}>
                  <div className={styles.feedbackInfo}>
                    <span className={styles.clienteNome}>&nbsp;</span>
                    <span className={styles.dataFeedback}>
                      {formatarDataBR(feedback.data_criacao)}
                    </span>
                  </div>
                  <div className={styles.estrelas}>
                    {"★".repeat(feedback.estrelas)}
                    {"☆".repeat(5 - feedback.estrelas)}
                  </div>
                  <p className={styles.comentario}>{feedback.comentario}</p>
                  {feedback.foto && (
                    <div className={styles.feedbackImagens}>
                      <img src={feedback.foto} alt="Imagem do Feedback" />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "#666" }}>
                Nenhum feedback encontrado ainda. Seja o primeiro a comentar!
              </p>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}