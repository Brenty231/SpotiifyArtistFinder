import { Button, Input } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export function App() {
  const clientID = "e856b4372ed1447f9de2cf6be0ec64d6";
  const redirectURI = "http://localhost:1234/";
  const authEndpoint = "https://accounts.spotify.com/authorize";
  const responseType = "token";
  const [token, setToken] = useState("");
  const [artist, setArtist] = useState("");
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];
      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }
    setToken(token);
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const FindArtists = async (e) => {
    e.preventDefault();
    const { data } = await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        q: artist,
        type: "artist",
      },
    });
    setArtists(data.artists.items);
    console.log(data);
  };
  const ArtistDetails = () => {
    return artists.map((artist) => (
      <div key={artist.id}>
        <h2>Artist: {artist.name}</h2>
        <p>Popularity: {artist.popularity}</p>
        <p>Followers: {artist.followers.total}</p>
        <p>Main Genre: {artist.genres[0]}</p>
        {artist.images.length ? (
          <img src={artist.images[0].url} width="500" alt="" />
        ) : (
          <div>No image </div>
        )}
      </div>
    ));
  };

  if (!token) {
    return (
      <div>
        <h1> Welcome to Spotify Artist finder !</h1>
        <br />
        <a
          href={`${authEndpoint}?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=${responseType}`}
        >
          Login To Spotify Here
        </a>
      </div>
    );
  }
  return (
    <div>
      <h1>Welcome to Spotify Artist finder !</h1>
      <br />
      <form onSubmit={FindArtists}>
        <Input type="text" onChange={(e) => setArtist(e.target.value)} />
        <Button type="submit" variant="contained" color="success">
          Search Artists
        </Button>
      </form>
      <Button variant="outlined" color="error" onClick={logout}>
        Logout of Spotify
      </Button>
      {ArtistDetails()}
    </div>
  );
}
