"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./RegisteredPersons.module.css";

export const RegisteredPersons = () => {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    // Solicitud inicial para obtener el número actual de usuarios registrados (priueba)
    axios
      .get("http://localhost:3001/usuarios")
      .then((response) => {
        setUserCount(response.data.length);
      })
      .catch((error) => {
        console.error("There was an error fetching the initial user count!", error);
      });

    const eventSource = new EventSource("http://localhost:3001/usuarios/esperarNotificaciones");
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setUserCount(data.totalUsuarios);
    };

    eventSource.onerror = (error) => {
      console.error("There was an error with the SSE connection:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className={styles.contenedor}>
      <h1 className="text-3xl font-bold text-blue-500 hover:text-blue-700 transition-colors duration-300">
        Número de usuarios actualizados en tiempo real
      </h1>
      <p className={styles.let}>Total de usuarios: {userCount}</p>
    </div>
  );
};
