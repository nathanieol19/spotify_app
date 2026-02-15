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

function App() {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

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
          <h2>{topTracks.length} tracks</h2>
          <ul>
            {topTracks.map((track) => (
              <li key={track.id}>
                {track.name} by {track.artists.map(a => a.name).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
