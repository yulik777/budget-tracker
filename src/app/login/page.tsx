"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../frontend/src/context/authContext";
import styles from "./page.module.css";

export default function LoginPage() {
  const { login, register } = useAuth();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, name, password);
      }
      router.push("/");
    } catch {
      alert("Auth error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>{isLogin ? "Login" : "Register"}</h1>

        <input
          className={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!isLogin && (
          <input
            className={styles.input}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          className={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.button} onClick={handleSubmit}>
          {isLogin ? "Login" : "Register"}
        </button>

        <button
          className={styles.switchButton}
          onClick={() => setIsLogin(!isLogin)}
        >
          Switch to {isLogin ? "Register" : "Login"}
        </button>
      </div>
    </div>
  );
}
