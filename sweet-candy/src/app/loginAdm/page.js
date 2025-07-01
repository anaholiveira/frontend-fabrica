'use client';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import styles from './page.module.css';
import { Formulario, Botao } from '@/components/Form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginAdm() {
    const router = useRouter();
    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        const email = event.target.email.value;
        const senha = event.target.senha.value;

        if (email === 'sweetcandycupcakeria@gmail.com' && senha === 'adm123') {
            const msg = 'Login realizado com sucesso!';
            setMensagem(msg);
            setTipoMensagem('sucesso');
            alert(msg);

            const clienteId = '123';
            localStorage.setItem('clienteId', clienteId);

            router.push('/area');
        } else {
            const msg = 'E-mail ou senha incorretos!';
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
            </form>
            <Footer />
        </div>
    );
}