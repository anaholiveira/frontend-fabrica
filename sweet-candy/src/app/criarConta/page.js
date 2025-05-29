import styles from './page.module.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Formulario, Botao } from '@/components/Form';
import Link from 'next/link';


export default function criarConta() {
    return (
        <div>
            <Header />
            <form className={styles.form}>
                <h1 className={styles.h1}> Criar conta</h1>
                <Formulario 
                name="nome" 
                text="Nome" 
                type="text" 
                id="nome" 
                placeholder="Digite seu nome completo"
                src="/images/nome.png"
                alt="Nome: "
                required 
                />

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

                <Formulario 
                name="senha" 
                text="Senha" 
                type="password" 
                id="senha" 
                placeholder="Digite sua senha"
                src="/images/senha.png"
                alt="Senha: "
                required 
                />

                <Formulario 
                name="confirmarSenha" 
                text="Confirmar senha" 
                type="password" 
                id="confirmarSenha" 
                placeholder="Confirme sua senha"
                src="/images/senha.png"
                alt="Confirmação de senha: "
                required 
                />

                <Formulario 
                name="cpf" 
                text="CPF" 
                type="text" 
                id="cpf" 
                placeholder="Digite seu cpf"
                src="/images/cpf.png"
                alt="CPF: "
                required 
                /> 

                <Botao
                href="/pedido"
                type="submit"
                text="Entrar" 
                />


                <div className={styles.naoPossuiConta}>
                    <p>Já possui uma conta?</p>
                    <Link className={styles.link} href="/login">Faça seu login</Link>
                </div>              

            </form>

            <Footer />
        </div>
    )
}