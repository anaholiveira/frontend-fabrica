import Footer from '@/components/Footer';
import Header from '@/components/Header';
import styles from './page.module.css';
import { Formulario, Botao } from '@/components/Form';
import Link from 'next/link';

export default function Login() {
    return (
        <div>
            <Header />

            <form className={styles.form}>
                <h1 className={styles.h1}>Fazer login</h1>
                
                <Formulario 
                name="email" 
                text="E-mail" 
                type="text" 
                id="email" 
                placeholder="Digite seu e-mail"
                src="/images/email.png"
                alt="E-mail: "
                required 
                />

                <div className={styles.separarInput}>
                    <Formulario 
                    name="senha"
                    text="Senha"
                    type="password"
                    placeholder="Digite sua senha"
                    src="/images/senha.png"
                    alt="Senha: "
                    required 
                    />
                </div>
                    
                <Botao
                href="/pedido"
                type="submit"
                text="Entrar"
                />
                
                <div className={styles.naoPossuiConta}>
                    <p>Não possui uma conta?</p>
                    <Link className={styles.link} href="/criarConta">Crie uma</Link>
                </div>

            </form>
            <Footer />
        </div>
    )
}