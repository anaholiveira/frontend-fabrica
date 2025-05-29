'use client';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import Header from '@/components/Header';
import { useState } from 'react'; 

export default function pedidosFeitos() {
    const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

    const verDetalhes = () => {
        setMostrarDetalhes(!mostrarDetalhes);
    };

    const fecharDetalhes = (e) => {
        if (e.target.id === 'overlay') {
            setMostrarDetalhes(false);
        }
    };

    return (
        <div>
            <Header />
            <div>
                <form className={styles.form}>
                    <h1 className={styles.h1}>Pedidos feitos</h1>

                    <div className={styles.botoesCima}>
                        <button className={styles.buttonCima}>Em andamento</button>
                        <button className={styles.buttonCima}>Finalizados no dia</button>
                    </div>

                    <div className={styles.detalhePedido}>
                        <p className={styles.id}>ID: 1</p>
                        <p className={styles.data}>Data: 2025/04/02</p>

                        <button type="button" className={styles.button} onClick={verDetalhes}>
                            {mostrarDetalhes ? 'Ocultar detalhes' : 'Mostrar detalhes'}
                        </button>
                    </div>
                </form>
            </div>

            {mostrarDetalhes && (
                <div id="overlay" className={styles.overlay} onClick={fecharDetalhes}>
                    <div className={styles.detalhesExtras} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.divDetalhes}>
                            <p><strong>ID:</strong>01</p>
                            <p><strong>Data:</strong>2025/04/01</p>
                            <p><strong>E-mail:</strong> cliente@example.com</p>
                            <p><strong>Valor total:</strong> R$ 100,00</p>
                            <p><strong>Forma de pagamento:</strong> Cartão de Crédito</p>
                        </div>

                        <div className={styles.divDetalhes}>
                            <p><strong>Tamanho:</strong> Grande</p>
                            <p><strong>Recheio:</strong> Chocolate</p>
                            <p><strong>Cobertura:</strong> Brigadeiro</p>
                            <p><strong>Cor da cobertura:</strong> Marrom</p>
                        </div>

                        <div className={styles.divDetalhes}>
                            <p><strong>Rua:</strong> Av. Paulista</p>
                            <p><strong>Número:</strong> 1000</p>
                            <p><strong>Bairro:</strong> Bela Vista</p>
                            <p><strong>CEP:</strong> 01310-100</p>
                            <p><strong>Complemento:</strong> Apto 100</p>
                        </div>

                        <div className={styles.divDetalhes}>
                            <p><strong>Status:</strong>Em andamento</p>
                        </div>

                        <button className={styles.buttonMarcarConcluido}>Marcar como finalizado</button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}