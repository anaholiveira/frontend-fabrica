import Image from "next/image";
import Link from "next/link";
import styles from './HeaderSobreNos.module.css';

export default function SobreNos() {
    return (
        <div className={styles.header}>
            <Image className={styles.logo} src="/images/logosweetcandy.png" alt="Logo Sweet Candy" width={140} height={140}/>
            <nav className={styles.nav}>
                <ul className={styles.ul}>
                    <li className={styles.li}><Link className={styles.entrarCadastrar} href="/login">Entrar</Link></li>
                </ul>
            </nav>
        </div>
    )
}