'use client';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import styles from './page.module.css';
import { Formulario, Botao } from '@/components/Form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
    const router = useRouter();
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        const email = event.target.email.value;
        const senha = event.target.senha.value;

        try {
            const resposta = await fetch('https://apisweetcandy.dev.vilhena.ifro.edu.br/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                const msg = dados.mensagem || 'Login realizado com sucesso!';
                setMensagem(msg);
                setTipoMensagem('sucesso');
                alert(msg);

                if (dados.clienteId) {
                    localStorage.setItem('clienteId', dados.clienteId.toString());
                } else {
                    alert('Erro: clienteId não retornado pela API.');
                    return;
                }

                router.push('/pedido');
            } else {
                const msg = dados.mensagem || 'Erro ao realizar login!';
                setMensagem(msg);
                setTipoMensagem('erro');
                alert(msg);
            }
        } catch (erro) {
            const msg = 'Erro ao conectar com o servidor!';
            setMensagem(msg);
            setTipoMensagem('erro');
            alert(msg);
        }
    }

    return (
        <div>
            <Header />
            <form className={styles.form} onSubmit={handleSubmit}>
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
    );
}