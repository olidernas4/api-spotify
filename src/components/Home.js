import React, { useState, useEffect } from "react";
import { loginUrl, searchSpotify, getTokenFromUrl } from "../services/spotify";

const Home = () => {
    const [token, setToken] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const resultsPerPage = 10; 

    useEffect(() => {
        const accessToken = getTokenFromUrl();
        if (accessToken) {
        setToken(accessToken);
        window.location.hash = ""; // Limpiar la URL
        localStorage.setItem("spotifyToken", accessToken); // Guardar el token
        } else {
        const storedToken = localStorage.getItem("spotifyToken");
        if (storedToken) {
            setToken(storedToken);
        }
        }
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;// Evita la búsqueda vacía

        const results = await searchSpotify(token, searchQuery);
        setSearchResults(results);
        setCurrentPage(1); // Reinicia la paginación al buscar
    };

    // Calcular los resultados visibles en la página actual
    const indexOfLastResult = currentPage * resultsPerPage;
    const indexOfFirstResult = indexOfLastResult - resultsPerPage;
    const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

    // Funciones de paginación
    const nextPage = () => {
        if (indexOfLastResult < searchResults.length) {
        setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
        setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div style={styles.container}>
        {token ? (
            <>
            <h1>Spotify App</h1>
            <form onSubmit={handleSearch}>
                <input
                type="text"
                placeholder="Search for a song, artist or album"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.input}
                />
                <button type="submit" style={styles.button}>
                Search
                </button>
            </form>

            {/* Mostrar los resultados de la búsqueda */}
            <div style={styles.gridContainer}>
                {currentResults.map((item) => (
                <div key={item.id} style={styles.card}>
                    <a href={`/details/${item.id}`} style={styles.cardLink}>
                    <img src={item.image} alt={item.name} style={styles.image} />
                    <h3>{item.name}</h3>
                    </a>
                </div>
                ))}
            </div>
            <div style={styles.pagination}>
                <button onClick={prevPage} style={styles.button} disabled={currentPage === 1}>
                Previous
                </button>
                <span style={{ margin: "0 10px" }}>
                Page {currentPage} of {Math.ceil(searchResults.length / resultsPerPage)}
                </span>
                <button
                onClick={nextPage}
                style={styles.button}
                disabled={indexOfLastResult >= searchResults.length}
                >
                Next
                </button>
            </div>
            </>
        ) : (
            <>
            <h1>Spotify App</h1>
            <p>Please log in to continue</p>
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
    marginTop: "20%",
    backgroundColor: "black",
    color: "white",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
    input: {
    padding: "10px",
    width: "300px",
    marginRight: "10px",
    },
    image: {
    width: "100%",
    height: "auto",
    borderRadius: "5px",
    },
    gridContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    margin: "20px",
    },
    card: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "15px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    },
    cardLink: {
    textDecoration: "none",
    color: "white",
    },
    pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "20px 0",
    },
    };

export default Home;