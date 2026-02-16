import { useEffect, useState } from 'react';
import axios from 'axios';

type Artist = {
  name: string;
};

type Track = {
  id: string;
  name: string;
  artists: Artist[];
};

type FollowedArtist = {
  id: string;
  name: string;
};

function App() {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [following, setFollowing] = useState<FollowedArtist[]>([]);

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  useEffect(() => {
    if (token) {
      localStorage.setItem('spotify_token', token);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    axios
      .get('https://api.spotify.com/v1/me/following?type=artist', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFollowing(res.data.artists.items))
      .catch((err) => console.error(err));
  }, [token]);

  useEffect(() => {
    if (!token) return;

    axios
      .get('https://api.spotify.com/v1/me/top/tracks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTopTracks(res.data.items))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div>
      {!token ? (
        <a href="http://127.0.0.1:8888/login">Login with Spotify</a>
      ) : (
        <div>
          <h1>Your Top Tracks</h1>
          <ul>
            {topTracks.map((track) => (
              <li key={track.id}>
                {track.name} by {track.artists.map(a => a.name).join(', ')}
              </li>
            ))}
          </ul>

          <h1>Artists You Follow</h1>
          <ul>
            {following.map((artist) => (
              <li key={artist.id}>{artist.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
