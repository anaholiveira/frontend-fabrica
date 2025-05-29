import styles from './Form.module.css';
import Image from 'next/image';
import Link from 'next/link';

export function Formulario({name, text, type, placeholder, src, alt}) {
    return (
            <div>
                <label className={styles.label} htmlFor={name}>{text}</label>
                <Image className={styles.icones} src={src} alt={alt} width={33} height={33}/>
                <input className={styles.input} type={type} id={name} name={name} placeholder={placeholder} />
            </div>
    )
}

export function Botao({text, href, type}) { 
    return (
        <div>
            <button className={styles.button} type={type}><Link className={styles.link} href={href}>{text}</Link></button>
        </div>
    )
}