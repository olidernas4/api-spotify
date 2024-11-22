import React, { useEffect, useState } from "react";
import { loginUrl, getTokenFromUrl } from "../services/spotify"; 
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const accessToken = getTokenFromUrl();
    if (accessToken) {
      setToken(accessToken);
      window.location.hash = ""; // Limpiar la URL después de obtener el token
      localStorage.setItem('spotifyToken', accessToken); // Guardar el token en localStorage
      navigate("/home"); // Redirigir a la página de inicio después de obtener el token
    } else {
      console.error("No se encontró el token en la URL.");
    }
  }, [navigate]);

  return (
    <div style={styles.container}>
      {token ? (
        <>
          <h1>Welcome to Spotify App</h1>
          <p>Your token: {token}</p>
        </>
      ) : (
        <>
          <h1>Spotify App</h1>
          <p>Por favor, inicie sesión para continuar</p>
          <a href={loginUrl} style={{ textDecoration: "none" }}>
            <button style={styles.button}>Login with Spotify</button>
          </a>
        </>
      )}
    </div>
  );
};

const styles = {
  
  container: {
    textAlign: "center",
    marginTop: "10%",
    backgroundColor: "black",
    color: "white",
    height: "100vh",
  },
  button: {
    backgroundColor: "#1DB954",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "16px",
  },
};


document.body.style.backgroundColor = "black"; 

export default Login;
