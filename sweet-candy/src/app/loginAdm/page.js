'use client';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import styles from './page.module.css';
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

                <label className={styles.label} htmlFor="email">E-mail:</label>
                <input 
                    type="text" 
                    name="email" 
                    id="email" 
                    placeholder="Digite seu e-mail" 
                    className={styles.input} 
                    required 
                />

                <div className={styles.separarInput}>
                    <label className={styles.label} htmlFor="senha">Senha:</label>
                    <input 
                        type="password" 
                        name="senha" 
                        id="senha" 
                        placeholder="Digite sua senha" 
                        className={styles.input} 
                        required 
                    />
                </div>

                <button type="submit" className={styles.botao}>Entrar</button>
            </form>
            <Footer />
        </div>
    );
}