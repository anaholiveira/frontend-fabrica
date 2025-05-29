"use client";
import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CadastrarFeedback() {
    const [mensagem, setMensagem] = useState(false);

    function msg(event) {
        const arquivo = event.target.files;
        if (arquivo.length > 0) {
            setMensagem(true);
            setTimeout(() => setMensagem(false), 3000);
        } else {
            setMensagem(false); 
        }
    }

    return (
        <div>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.h1}>Comentar</h1>

                <div className={styles.rating}>
                    <input className={styles.input} type="radio" name="estrela" id="star5" />
                    <label className={styles.label} htmlFor="star5">★</label>
                    <input className={styles.input} type="radio" name="estrela" id="star4" />
                    <label className={styles.label} htmlFor="star4">★</label>
                    <input className={styles.input} type="radio" name="estrela" id="star3" />
                    <label className={styles.label} htmlFor="star3">★</label>
                    <input className={styles.input} type="radio" name="estrela" id="star2" />
                    <label className={styles.label} htmlFor="star2">★</label>
                    <input className={styles.input} type="radio" name="estrela" id="star1" />
                    <label className={styles.label} htmlFor="star1">★</label>
                </div>

                <label className={styles.label} htmlFor="feedback">
                    <input className={styles.input} type="text" placeholder="Digite seu feedback..." />
                </label>

                <label className={styles.label} htmlFor="image" id="file" tabIndex="0">
                    <span className={styles.filee}> Carregue fotos</span>
                    <input 
                        className={`${styles.input} ${styles.image}`}
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={msg}
                    />
                    <span>
                        <img className={styles.fotoinput} src="/images/importimage.png" alt="imagem" />
                    </span>
                </label>

                {mensagem && (
                    <div className={styles.aviso}>
                        Imagem anexada com sucesso! 𐙚  
                    </div>
                )}

                <div className={styles.buttons}>
                    <Link href="/vendaCupcake">
                    <button className={styles.button} id="back">Voltar</button>
                    </Link>

                    <Link href="/pedido">
                    <button className={styles.button} id="confirm">Confirmar</button>
                    </Link>
                </div>
                
            </div>
            <Footer />
        </div>
    );
}