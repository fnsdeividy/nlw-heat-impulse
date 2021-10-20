import { useContext } from "react";
import { VscGithubInverted } from "react-icons/vsc";
import { AuthContext } from "../../contexts/auth";
import styles from "./styles.module.scss";




export function LoginBox() {
  
    const { signInUrl } = useContext(AuthContext)

    
  return (
    <div className={styles.loginBoxWrapper}>
      <strong>Entre e compartilhe sua imagem</strong>
      <a href={signInUrl} className={styles.signInWithGithub}>
        <VscGithubInverted size={35} />
        Entrar com Github
      </a>
    </div>
  );
}
