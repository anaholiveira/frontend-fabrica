'use client'
import Footer from "@/components/Footer";
import HeaderSobreNos from "@/components/HeaderSobreNos";
import styles from './page.module.css';

export default function SobreNos() {

    return (
        <div>
            <HeaderSobreNos />
            <div className={styles.sobreNos}>
                <h1 className={styles.h1}>Sweet Candy</h1>
                <h2 className={styles.h2}>Sobre nós</h2>
                <p className={styles.p}>
                    Bem-vindo ao nosso site! Somos uma equipe de 6 pessoas dedicadas a criar um software de venda de cupcakes personalizados que atendam às preferências individuais de cada cliente.
                </p>

                <h2 className={styles.h2}>Nossa proposta</h2>
                <p className={styles.p}>
                    Aqui, você pode personalizar cada detalhe do seu cupcake, desde a massa até a embalagem. Queremos que você tenha a liberdade de criar o cupcake perfeito, que atenda exatamente ao seu gosto, de forma prática e rápida.
                </p>

                <h2 className={styles.h2}>Nossa equipe</h2>
                <p className={styles.p}>
                    Atualmente, estamos em fase de desenvolvimento do site, focando em proporcionar uma interface intuitiva que facilite a sua experiência de compra. Cada membro da nossa equipe contribui em áreas essenciais, garantindo qualidade e inovação, sempre pensando em como tornar a sua experiência de compra a melhor possível.
                </p>

                <h2 className={styles.h2}>Compromisso com a qualidade</h2>
                <p className={styles.p}>
                    Nosso objetivo é fazer com que cada cupcake que você receber seja não apenas saboroso, mas também exatamente como você imaginou. Agradecemos pelo seu interesse e mal podemos esperar para compartilhar nossas delícias com você!
                </p>
            </div>
            <Footer />
        </div>
    );
}