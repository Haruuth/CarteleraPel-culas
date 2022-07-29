import './SelectedMovies.css';

function SelectedMovies({movie}) {
    return (
    <div className="title">
        <h1>
            {movie.original_title}
        </h1>

        <p>
            {movie.overview}
        </p>  
    </div>
    );
  }
  
  export default SelectedMovies;

  