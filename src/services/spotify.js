export const authEndpoint = "https://accounts.spotify.com/authorize";

const clientId = "57ee4dcec93a4912b180f2addad335bc"; // mi client id
const redirectUri = "http://localhost:3000";
const scopes = [
  "user-read-playback-state",
  "user-read-currently-playing",
  "user-read-email",
  "user-read-private",
  "user-modify-playback-state", // esto es para poder controlar la produccion documentacion spotify
];

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
  redirectUri
)}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;

export const getTokenFromUrl = () => {
  const hash = window.location.hash;
  const token = hash // obtiene el token de la url
    .substring(1)// quita el # de la url
    .split("&")// separa el token de los demas datos
    .find((elem) => elem.startsWith("access_token="))
    ?.split("=")[1];
  return token;
};

export const getTrackDetails = async (token, trackId) => {
  const url = `https://api.spotify.com/v1/tracks/${trackId}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching track details from Spotify API');
  }

  const data = await response.json();

  return {
    name: data.name,
    artist: data.artists[0]?.name,
    album: data.album?.name,
    image: data.album?.images[0]?.url || '',
    preview_url: data.preview_url || '',
  };
};

export const getDetailsFromSpotify = async (token, type, id) => {
  const url = `https://api.spotify.com/v1/${type}s/${id}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Error fetching details from Spotify API');
  }

  const data = await response.json();

  return {
    name: data.name,
    image: data.images ? data.images[0]?.url : '',
    description: data.description || '',
    preview_url: data.preview_url || '', // Para tracks
  };
};

export const searchSpotify = async (token, query) => {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${query}&type=track,album,artist&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  const results = [];

  if (data.tracks) {
    data.tracks.items.forEach((track) => {
      results.push({
        id: track.id,
        name: track.name,
        type: "track",
        image: track.album.images[0]?.url || "",
      });
    });
  }

  if (data.albums) {
    data.albums.items.forEach((album) => {
      results.push({
        id: album.id,
        name: album.name,
        type: "album",
        image: album.images[0]?.url || "",
      });
    });
  }

  if (data.artists) {
    data.artists.items.forEach((artist) => {
      results.push({
        id: artist.id,
        name: artist.name,
        type: "artist",
        image: artist.images[0]?.url || "",
      });
    });
  }

  return results;
};

