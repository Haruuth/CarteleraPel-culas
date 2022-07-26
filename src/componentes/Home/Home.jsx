import './Home.css';
import {useState, useEffect } from 'react';
import SelectedMovies from '../SelectedMovies/SelectedMovies'


function Home() {

    //const API_URL = "https://api.themoviedb.org/3/"
    //const myApiKey = "cb3c459016a424abc5e3f9b307c45a5e" 
    const [Peliculas, setPeliculas] = useState( {page: 0 , data: []} )
    const [SearchedMovies, setSearchedMovies] = useState( {searched: false, data: []} );
    const [SelectedMovie, setSelectedMovie] = useState({})

    //El segundo argumento del useEffect se encarga de vigilar las variables que hemos creado en react y ejecutar en caso de cambio.
    useEffect (function(){
        if (!Peliculas.data.length ) {
            ( async () => {
                let dataMovies = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=cb3c459016a424abc5e3f9b307c45a5e&language=en-US&page=1`) 
                dataMovies = await dataMovies.json();
                
                console.log("data of Movies", dataMovies.results);
                if (dataMovies.results) {
                    setPeliculas({page: dataMovies.page, data:dataMovies.results});
                }
            })()
        }
    }, [Peliculas])

    // function useState (arg) {
    //     function modifArg(arg2){
    //         //se reconstruye el componente, useState es una función con 2 argumentos creados en el cual únicammente podemos modificar el segundo
    //         arg = arg2
    //     }
    //     return[arg, modifArg]
    // }

    const cardStyle = { marginTop: SelectedMovie.id ? "0" : "200px" , display: "flex", flexDirection: "row", padding: "0px 50px 15px 15px", justifyContent: "flex-start" };
    const border = {border: "1px solid #000"};

    const switchSelectedMovie = (arg) => {
          setSelectedMovie(arg); 
    }

    const searchValueChange = async (val) => {
        //ESTA API ES MALA, NO PODEMOS NI BUSCAR POR OVERVIEW
        
        if (!val) val = "''";

        let result = await fetch ("https://api.themoviedb.org/3/search/movie?api_key=cb3c459016a424abc5e3f9b307c45a5e&language=en-US&page=1&query=" + val)
        result = await result.json();

        setSearchedMovies({ selected: val ==="''" ? false : true, data: result.results });
        
    }

    const changePage = async (arg) => {
        let fetchText = "https://api.themoviedb.org/3/movie/top_rated?api_key=cb3c459016a424abc5e3f9b307c45a5e&language=en-US&page=";
        if (arg) {
            fetchText += Peliculas.page + 1;
        } else {
            fetchText += Peliculas.page - 1;
        }

        let dataMovies = await fetch(fetchText) 
        dataMovies = await dataMovies.json();
        
        console.log("data of Movies", dataMovies.results);

         if (dataMovies.results) {
             setPeliculas({page: dataMovies.page, data:dataMovies.results});
         }
    }

    const returnData = pelicula => {
        return <div onClick = {() => switchSelectedMovie(pelicula)} style={border}>
                    <h5> { pelicula.title } </h5>
                    <img style={{ width: "220px", height: "300px" }} src = { "https://image.tmdb.org/t/p/original" + pelicula.poster_path } alrt=""/>
                </div>
    }            

    return (
        <>
            <div style={{position : "fixed", top: 0, flexDirection: "column", display: "flex", justifyContent: "center", width: "100%", alignItems: "center", heigth: "36%", background: "rgb(0 0 0 / 82%)"}}>
                <div id="buscador">
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" 
                        width="16" height="16" fill="currentColor" 
                        class="bi bi-search" 
                        viewBox="0 0 16 16"> 
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/> 
                        </svg>
                    </span>
                    <input onChange={ _inputValue => searchValueChange(_inputValue.target.value)} placeholder='Buscar'/>

                </div>
            </div>
            {
                SelectedMovie.id
                ? <SelectedMovies movie = {SelectedMovie}/> 
                : <></>
            }
            <div style={cardStyle}> 
                {
                    SearchedMovies.selected
                    ?   SearchedMovies.data.map( pelicula => returnData(pelicula))
                    :   Peliculas.data.map( pelicula => returnData(pelicula))

                }
                {   
                    (SearchedMovies.selected && !SearchedMovies.data.length)
                    ? <h1>No hay coincidencias</h1>
                    : <></>
                }
            </div> 
            {
                SearchedMovies.selected 
                ?   <></>
                :   (
                    <div style={{display:"flex",justifyContent: "center"}}>
                        <button onClick={ () => changePage(false)}>
                            Anterior
                        </button>
                        {Peliculas.page}
                        <button onClick={ () => changePage(true)}>
                            Siguiente
                        </button>
                    </div>
                )
            }


        </>
  );
}
export default Home;

