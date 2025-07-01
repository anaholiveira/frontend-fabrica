'use client';
import styles from './page.module.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Link from 'next/link';

export default function Escolha() {
    return(
        <main>
        <Header />
        <div className={styles.fundo}>
            <p className={styles.p}>Como deseja acessar?</p>
            <button className={styles.button} type='submit'><Link href='/login'>Cliente</Link></button>
            <button className={styles.button} type='submit'><Link href='/loginAdm'>Administrador</Link></button>
        </div>
        <Footer />
    </main>
    )
}