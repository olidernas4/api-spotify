import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTrackDetails } from "../services/spotify"; 

const Details = () => {
  const { id } = useParams(); //  ID de la canción desde la URL
  const [track, setTrack] = useState(null); // Estado para los detalles de la canción
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); // Estado para el indicador de carga

    useEffect(() => {
        const fetchTrackDetails = async () => {
        try {
            const token = localStorage.getItem("spotifyToken"); //  token almacenado
            if (!token) {
            setError("No token available. Please log in.");
            setLoading(false);
            return;
            }

            const trackDetails = await getTrackDetails(token, id); // Llama a la API
            console.log("Track details:", trackDetails); // Verifica los datos de la canción

            setTrack(trackDetails); // Guarda los detalles en el estado
        } catch (err) {
            console.error("Error fetching track details:", err);
            setError("Failed to load track details. Please try again later.");
        } finally {
            setLoading(false); // Detén el indicador de carga
        }
        };

        fetchTrackDetails();
    }, [id]);

    if (loading) {
        return <p style={styles.loadingText}>Loading...</p>; 
    }

    if (error) {
        return <p style={styles.errorText}>{error}</p>; // Mensaje de error
    }

    if (!track) {
        return <p style={styles.errorText}>No music found.</p>; 
    }

    // Acceso directo a los datos
    const albumImage = track.image || "https://via.placeholder.com/300"; // Usamos track.image directamente
    const trackName = track.name || "Unknown Track"; 
    const artistName = track.artist || "Unknown Artist"; 
    const albumName = track.album || "Unknown Album"; 
    const previewUrl = track.preview_url; 

    return (
        <div style={styles.container}>
        <div style={styles.card}>
            <img
            src={albumImage}
            alt={trackName}
            style={styles.image}
            />
            <h2 style={styles.trackName}>{trackName}</h2>
            <p style={styles.artistAlbumText}>Artist: {artistName}</p>
            <p style={styles.artistAlbumText}>Album: {albumName}</p>
            {previewUrl ? (
            <audio controls style={styles.audio}>
                <source src={previewUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>
            ) : (
            <p style={styles.errorText}>No preview available for this track.</p>
            )}
        </div>
        </div>
    );
};

const styles = {
  // Fondo negro para toda la página
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#1c1c1c", // Fondo negro oscuro
        color: "#2DA933", 
        fontFamily: "'Helvetica Neue', sans-serif", 
    },
    card: {
        border: "1px solid #444",
        borderRadius: "10px",
        padding: "20px",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
        backgroundColor: "#121212", 
        maxWidth: "400px",
        width: "100%",
    },
    image: {
        width: "100%",
        height: "auto",
        borderRadius: "10px",
        marginBottom: "20px",
    },
    trackName: {
        fontSize: "24px",
        fontWeight: "bold",
        margin: "10px 0",
        color:"white",
    },
    artistAlbumText: {
        fontSize: "16px",
        margin: "5px 0",
    },
    audio: {
        width: "100%",
        marginTop: "20px",
    },
    loadingText: {
        color: "#1DB954", 
        textAlign: "center",
        fontSize: "18px",
    },
    errorText: {
        color: "red", 
        textAlign: "center",
        fontSize: "16px",
    },
};

export default Details;
