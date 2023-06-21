import './Home.css';
import { useState, useEffect } from 'react';
import SelectedMovies from '../SelectedMovies/SelectedMovies'

const border = { border: "1px solid #000" };
const moviesDefault = { page: 0, data: [], total_pages: 0 };
const urlMovie = 'https://api.themoviedb.org/3/';

function Home() {

    const [movies, setMovies] = useState(moviesDefault);
    const [selectedMovie, setSelectedMovie] = useState({});
    const [queryMovie, setQueryMovie] = useState("");
    const [page, setPage] = useState(1);

    const [forcedReRender, setForcedReRender] = useState(0);

    const cardStyle = {
        marginTop: selectedMovie.id ? "0" : "200px",
        display: "flex", flexDirection: "row",
        padding: "0px 50px 15px 15px",
        justifyContent: "flex-start"
    };

    useEffect(() => {
        (async () => {
            if (forcedReRender === 0) {
                return
            };
            let url = `${urlMovie}movie/top_rated?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`

            if (queryMovie) {
                url = `${urlMovie}search/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`;
                url += `&query=${queryMovie}`;
            }

            url += `&page=${page}`;

            let dataMovies = await fetch(url)
            dataMovies = await dataMovies.json();
            if (dataMovies.results) {
                console.log("data of Movies", dataMovies.results);
                setMovies({ page: dataMovies.page, data: dataMovies.results, total_pages: dataMovies.total_pages });
            } else {
                setMovies(moviesDefault);
            }
        })();
    }, [page, forcedReRender])

    useEffect(() => {
        if (page === 1) {
            setForcedReRender(forcedReRender + 1);
        } else {
            setPage(1);
        }
    }, [queryMovie])

    const changePage = pageDirection => {
        setPage(movies.page + (pageDirection ? 1 : -1));
        setForcedReRender(forcedReRender + 1);
    }

    const mappedMovies = (movie, index) => {
        return <div key={index} onClick={() => { setSelectedMovie(movie) }} style={border}>
            <h5> {movie.title} </h5>
            <img style={{ width: "220px", height: "300px" }} src={"https://image.tmdb.org/t/p/original" + movie.poster_path} alt={movie.title} />
        </div>
    }

    return (
        <>
            <div style={{ position: "fixed", top: 0, flexDirection: "column", display: "flex", justifyContent: "center", width: "100%", alignItems: "center", heigth: "36%", background: "rgb(0 0 0 / 82%)" }}>
                <div id="buscador">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            width="16" height="16" fill="currentColor"
                            className="bi bi-search"
                            viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </span>
                    <input onChange={inputValue => setQueryMovie(inputValue.target.value)} placeholder='Buscar' />
                </div>
            </div>

            {selectedMovie.id && <SelectedMovies movie={selectedMovie} />}

            <div style={cardStyle}>
                {(movies.data && !movies.data.length) && <h1>No hay coincidencias</h1>}
                {movies.data.map(mappedMovies)}
            </div>
            {movies.data.length && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button onClick={() => changePage(false)}>
                        Anterior
                    </button>
                    {page}
                   <button onClick={() => changePage(true)}>
                        Siguiente
                    </button>
                </div>
            )}
        </>
    );
}
export default Home;

