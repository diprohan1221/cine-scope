import { useEffect, useState } from "react";

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setMovies(data.results || []);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Hello, CineScope 🎬</h1>
      <ul className="space-y-2">
        {movies.map(movie => (
          <li key={movie.id} className="text-lg text-gray-800">
            {movie.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
