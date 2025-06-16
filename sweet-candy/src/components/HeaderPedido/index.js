'use client';
import Link from "next/link";
import styles from "./HeaderPedido.module.css";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();

    function handleLogout() {
        localStorage.removeItem('clienteId');
        router.push('/login');
    }

    return (
        <header className={styles.header}>
            <div className={styles.leftHeader}>
                <Image 
                    className={styles.logo} 
                    src='/images/logosweetcandy.png' 
                    alt="Logo Sweet Candy" 
                    width={95} 
                    height={50}
                />

                <div>
                    <nav>
                        <ul className={styles.menu}>
                            <li className={styles.itemMenu}>
                                Menu
                                <ul className={styles.submenu}>
                                    <li className={styles.itemSubmenu}>
                                        <Link className={styles.linkSubmenu} href="/feedback">Feedback</Link>
                                    </li>
                                    <li className={styles.itemSubmenu}>
                                        <button className={styles.linkSubmenu} onClick={handleLogout}>Sair</button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className={styles.rightHeader}>
                <p className={styles.cupcakeria}>Cupcakeria</p>
            </div>
        </header>
    );
}