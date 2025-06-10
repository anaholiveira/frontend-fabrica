import styles from './Form.module.css';
import Image from 'next/image';

export function Formulario({ name, text, type, placeholder, src, alt, onChange, value, maxLength }) {
    return (
        <div>
            <label className={styles.label} htmlFor={name}>{text}</label>
            <Image className={styles.icones} src={src} alt={alt} width={33} height={33} />
            <input
                className={styles.input}
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                value={value}
                maxLength={maxLength}
            />
        </div>
    );
}

export function Botao({ text, type }) { 
    return (
        <div>
            <button className={styles.button} type={type}>{text}</button>
        </div>
    );
}