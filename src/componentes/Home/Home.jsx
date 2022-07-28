import './Home.css';
import {useState, useEffect } from 'react';
import SelectedMovies from '../SelectedMovies/SelectedMovies'


function Home() {

    //const API_URL = "https://api.themoviedb.org/3/"
    //const myApiKey = "cb3c459016a424abc5e3f9b307c45a5e" 92321
    const [Peliculas, setPeliculas] = useState([])
    const [SelectedMovie, setSelectedMovie] = useState({})

    //El segundo argumento del useEffect se encarga de vigilar las variables que hemos creado en react y ejecutar en caso de cambio.
    useEffect (function(){
        if (!Peliculas.length ) {
            ( async () => {
                //TODO: cambiar la url de la api por una mas generica
                let dataMovies = await fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=cb3c459016a424abc5e3f9b307c45a5e&language=en-US&page=1")
                
                
                dataMovies = await dataMovies.json();
                
                console.log("data of Movies", dataMovies.results);
                if (dataMovies.results) {
                    setPeliculas(dataMovies.results)
                }
            })()
        }
        console.log("Se construye el componente")
    }, [Peliculas])

    // function useState (arg) {
    //     function modifArg(arg2){
    //         //se reconstruye el componente, useState es una función con 2 argumentos creados en el cual únicammente podemos modificar el segundo
    //         arg = arg2
    //     }
    //     return[arg, modifArg]
    // }

    const cardStyle = { display: "flex", flexDirection: "row" };
    const border = {border: "1px solid #000"};

    const switchSelectedMovie = (arg) => {
          setSelectedMovie(arg); 
    }
    
    return (
        <>
        <div id="buscador">
            <input placeholder='Buscar'/>

        </div>

        {
            SelectedMovie.id
                ? <SelectedMovies movie = {SelectedMovie}/> 
                : <></>
        }
        
        <div style={cardStyle}> {
            Peliculas.length
            ?   Peliculas.map( pelicula => {
                return (
                        <div onClick = {() => switchSelectedMovie(pelicula)} style={border}>
                            <h1> { pelicula.title } </h1>
                            <img style={{ width:"300px" }} src = { "https://image.tmdb.org/t/p/original" + pelicula.poster_path } alrt=""/>
                        </div>
                    )
                })
            :   <></>
        }
        </div> 
        </>
  );
}
export default Home;

