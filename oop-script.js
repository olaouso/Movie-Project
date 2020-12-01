
//the API documentation site https://developers.themoviedb.org/3/

// this for homepage
class App {
    static async run(category) {
        const movies = await APIService.fetchMovies(category)
        const moviesGenres = await APIService.fetchMoviesGenres()
        // console.log(movies)
        HomePage.container.innerHTML = ""
        HomePage.row.innerHTML = ""
        HomePage.renderMovies(movies);
        MoviesGenres.renderMoviesGenres(moviesGenres);
    }
}
// this for atcorspage
class App1 {
    static async run() {
        const actors = await APIService.fetchActors()
        console.log(actors)
        HomePage.container.innerHTML = ""
        HomePage.row.innerHTML = ""
        AcotrsPage.renderActors(actors);
    }
}
// this part for search

class AppSearch {
    static async run(input) {
        const searchMovies = await APIService.fetchSearch(input)
        const searchActor =await APIService.fetchSearchActors(input)
        console.log(searchActor)
        HomePage.container.innerHTML = ""
         HomePage.row.innerHTML = ""
        HomePage.renderMovies(searchMovies);
        AcotrsPage.renderActors(searchActor);
    }
}

class AppDiscover {
    static async run(genreId) {
        const discoverMovies = await APIService.fetchDiscover(genreId)
        console.log(discoverMovies)
        HomePage.container.innerHTML = ""
         HomePage.row.innerHTML = ""
        HomePage.renderMovies(discoverMovies);
    }
}
class APIService {
    static TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    static async fetchMovies(category) {
        const url = APIService._constructUrl(`movie/${category}`)
        console.log(category)
        const response = await fetch(url)
        const data = await response.json()
        //  console.log(data.results.map(movie => new Movie(movie)));
        return data.results.map(movie => new Movie(movie))
    }

    static async fetchMoviesGenres() {
        const url = APIService._constructUrl(`genre/movie/list`)
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        return data.genres
    }
    // this part for search
    static async fetchSearch(input) {
      console.log(input)
        const url = APIService._searchUrl(`search/movie`, input)
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        return data.results.map(movie => new Movie(movie))
    }
      static async fetchSearchActors(input) {
        const url = APIService._searchUrl(`search/person`, input)
        const response = await fetch(url)
        const data = await response.json()
        return data.results.map(actor => new Actor(actor))
    }

    static _searchUrl(path, input) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}&query=${input}`;
    }
      static async fetchDiscover(genreId) {
    
        const url = APIService._discoverUrl(`discover/movie`, genreId)
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        return data.results.map(movie => new Movie(movie))
    }
     static _discoverUrl(path, genre) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}&with_genres=${genre}`;
    }
    // this for actorspage
    static async fetchActors() {
        const url = APIService._constructUrl(`person/popular`)
        const response = await fetch(url)
        const data = await response.json()
      console.log(data);
      return data.results.map(actor => new Actor(actor))
    }
    static async fetchActor(person_id) {
      console.log(person_id)
        const url = APIService._constructUrl(`person/${person_id}`)
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        return new Actor(data)
    }
    static async fetchActorMovies(person_id) {
        const url = APIService._constructUrl(`person/${person_id}/movie_credits`)
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        return data.cast.slice(0,5).map(movie => new Movie(movie))
        
    }
    // this for homepage
    static async fetchMovie(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}`)
        const response = await fetch(url)
        const data = await response.json()
        // console.log(data)
        return new Movie(data)
    }
    static async creditsFetch(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}/credits`)
        const response = await fetch(url)
        const data = await response.json()
        // console.log(data)
        return data.cast.slice(0,5).map(actor => new Actor(actor))
    }
    static async directorFetch(movieId) {
        const url = APIService._constructUrl(`movie/${movieId}/credits`)
        const response = await fetch(url)
        const data = await response.json()
        // console.log(data)
        const director = data.crew.find(crew => crew.job === "Director")
        // console.log(director)
        return new Actor(director) 
    }
    static async similarMoviesFetch(movieId){
        const url = APIService._constructUrl(`movie/${movieId}/similar`)
        const response = await fetch(url)
        const data = await response.json()
         return data.results.slice(0,5).map(movie => new Movie(movie))
    }
    static async trailerFetch(movieId){
        const url = APIService._constructUrl(`movie/${movieId}/videos`)
        const response = await fetch(url)
        const data = await response.json()
        return data.results[0]

    }

    static _constructUrl(path) {
        return `${this.TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`;
    }
}

  class HomePage {
    static container = document.getElementById('container');
    static row = document.createElement('div')
    static renderMovies(movies) {
    this.row.className = "row"

//Click to explore movie and hoover  
movies.forEach(movie => {
          const movieDiv = document.createElement('div');
          movieDiv.setAttribute('class', 'col-md-4 py-3');
          movieDiv.innerHTML = ` 
              <img src="${movie.backdropUrl}" alt="${movie.title} poster">
              <h3>${movie.title} <span class="fa fa-star checked yellow"> </span> ${movie.rate}</h3>
          <div class="overlay">
              <div class="text">${movie.overview}</div>
              </div>
              `;

              movieDiv.addEventListener('click', function() {
                Movies.run(movie);
              })
          this.row.appendChild(movieDiv)
          this.container.appendChild(this.row);
        })
          
    }
}
class MoviesGenres {
  
static dropDown = document.getElementById('dropDownMenu');
    static renderMoviesGenres(genres) {
        genres.forEach(genre => {
            const genreA = document.createElement("a");
            genreA.innerHTML = genre.name
            genreA.className = "dropdown-item"
            genreA.addEventListener("click", function() {
                AppDiscover.run(genre.id)
            
            });

            this.dropDown.appendChild(genreA);
        })
    }

}

class Movies {
    static async run(movie) {
        const movieData = await APIService.fetchMovie(movie.id)
        const movieCredits = await APIService.creditsFetch(movie.id)
        const similarMoviesFetch = await APIService.similarMoviesFetch(movie.id)
        const director = await APIService.directorFetch(movie.id)
        const trailer = await APIService.trailerFetch(movie.id)
        // console.log(movieCredits)
        MoviePage.renderMovieSection(movieData,movieCredits, similarMoviesFetch, director, trailer);
        }
}


class MoviePage {
    static container = document.getElementById('container');
    static renderMovieSection(movie,cast, similar, director, trailer) {
        MovieSection.renderMovie(movie,cast,similar, director, trailer);
    }
}

class MovieSection {
    static renderMovie(movie,cast, similar, director, trailer) {
      // console.log(similar)
        MoviePage.container.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <img id="movie-backdrop" src=${movie.backdropUrl} > 
        </div>
        <div class="col-md-4">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="genres">Movie Genres: ${movie.genres}</p>
          <p id="Rate">Movie Rate: ${movie.rate}</p>
          <p id="RateCount"> Number of Voting: ${movie.rateCount}</p>
          <p id="movie-release-date">Release Date: ${movie.releaseDate}</p>
          </div>
            <div class="col-md-4">
          <p id="movie-runtime">Duration: ${movie.runtime}</p>
          <p id="movie-language">Language: ${movie.language}</p>
          <p id="movie-director">Director: ${director.name}</p>
          <div id="movie-production">Production companies: <br>

          ${movie.production.map(production=> `
          <div>
          
          <p>${production.name} ${production.logo_path ?`
          <img src= ${Movie.BACKDROP_BASE_URL + production.logo_path} width=5%>` : ""}</p>
          </div>
          `
          ).join('')}
          </div>
      
        </div>
      </div>
      <div id="movie-overview" class="row">
      <div class="col-md-4">
        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="col-md-8">
        <h3>Overview:</h3>
        <p>${movie.overview}</p>
      </div>
      </div>
      <h3>Actors:</h3>
      <div class="credits">
        ${cast.map(actor => `
        <div>
          <img class="actorImg" src=${actor.profileUrl} id=${actor.id} width=100% >
          <p>${actor.name}</p>
        </div>
        `)}
      </div>
      <h3>Related Movies:</h3>
      <div class="Related">
        ${similar.map(similarMovies => `
        <div>::-webkit-scrollbar-thumb:hover {
	background: #ffc105;
}
          <img class="movieImg" src=${similarMovies.backdropUrl} id=${similarMovies.id} width=100%>
          <p>${similarMovies.title}</p>
        </div>
        `)}
      </div>`
      const actorImage = [...document.getElementsByClassName('actorImg')];
      
      actorImage.map(actor => actor.addEventListener('click',() => Actors.run(actor)));
      const movieImg = [...document.getElementsByClassName('movieImg')];
      
      movieImg.map(movie => movie.addEventListener('click', () => Movies.run(movie)));
    }
}

class Actor {
  static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
    constructor(json) {
      console.log(json);
        this.name = json.name;
        this.gender = json.gender===1? "Female" : "Male";
        this.birthday = json.birthday
        this.deathdate = json.deathday;
        this.id = json.id;
        this.popularity = json.popularity;
        this.biography = json.biography;
        this.profile_path = json.profile_path;
      
    }
      get profileUrl() {
      return this.profile_path ? Movie.BACKDROP_BASE_URL + this.profile_path : "";
    }
      

}
class Movie {
    static BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780';
    constructor(json) {
      // console.log(json)
        this.rate = json.vote_average;
        this.rateCount = json.vote_count;
        this.id = json.id;
        this.title = json.title;
        this.genres = "";
        this.production = json.production_companies;
        this.releaseDate = json.release_date;
        this.runtime = json.runtime + " minutes";
        this.overview = json.overview;
        this.language = json.original_language;
        this.backdrop_path = json.backdrop_path;
        for (let i in json.genres){
          this.genres += json.genres[i].name + ", "
        }
        
    }

    get backdropUrl() {
        return this.backdrop_path ? Movie.BACKDROP_BASE_URL + this.backdrop_path : "";
    }
}

document.addEventListener("DOMContentLoaded", () =>  App.run('now_playing'));


// This part for Actorspage:

class AcotrsPage {
    static renderActors(actors) {
        actors.forEach(actor => {
            const actorsDiv = document.createElement("div");
            actorsDiv.className = "col-md-4"
            const actorsImage = document.createElement("img");
            actorsImage.src = `${actor.profileUrl}`;
            const actorName = document.createElement("h3");
            actorName.textContent = `${actor.name}`;
            actorsImage.addEventListener("click", function() {
                Actors.run(actor);
            });

            actorsDiv.appendChild(actorName);
            actorsDiv.appendChild(actorsImage);
            HomePage.row.appendChild(actorsDiv)
            HomePage.container.appendChild(HomePage.row);
        })
    }
}
class Actors {
    static async run(actor) {
      console.log(actor)
        const actorData = await APIService.fetchActor(actor.id)
      const actorMovie= await APIService.fetchActorMovies(actor.id)
        console.log(actorMovie)
        ActorPage.renderActorsSection(actorData, actorMovie);
        }
}

class ActorPage {
    static container = document.getElementById('container');
    static renderActorsSection(actor,actorMovie) {
        ActorsSection.renderActors(actor, actorMovie);
    }
}


class ActorsSection {
    static renderActors(actor, actorMovie) {
  console.log(actorMovie)
        ActorPage.container.innerHTML = `
      <div class="row">
        <div class="col-md-4">
          <img id="actor-image" src=${actor.profileUrl} width=50%> 
        </div>
        <div class="col-md-4">
          <h2 id="actor-name">${actor.name}</h2>
          <p id="actor-gender">Actor Gender: ${actor.gender}</p>
          <p id="actor-popularity">Actor Popularity: ${actor.popularity}</p>
          <p id="actor-birthday">Actor Birthday: ${actor.birthday}</p>
          ${actor.deathdate ? `<p id="actor-deathday">Actor Death Date: ${actor.deathdate}</p>` : ""}          
          
          </div>
          <p id="actor-biography"><strong>Biography</strong>: ${actor.biography}</p>
          </div>
          <div>
          <h3>Movies:</h3>
          <div class="ActorsMovies">
            ${actorMovie.map(movie => `
            <div>
              <img class="actorMovieImg" src=${movie.backdropUrl} id=${movie.id} width=100%>
              <p>${movie.title}</p>
            </div>
            `)}
          </div>`
          const actorMovieImg = [...document.getElementsByClassName('actorMovieImg')];
      
      actorMovieImg.map(movie => movie.addEventListener('click', () => Movies.run(movie)));
    }
}

// this class for about page
class About {
  static run() {
    HomePage.container.innerHTML = `
    <div class="about">
    <h1>Thanks for visiting our website</h1>
    <br>
    <p>This website helps you to find the most poupular movies and actors, please donate to develope this website.
    <br>
    We’re The world leader in online Movie Data base information. Our team is working 24 hours, seven days a week to provide the latest information available for the most recent movies, Actors, review, ratings and trailers. 
    <br>
    The views and opinions expressed in this website are those of the authors and do not necessarily reflect the official policy or position of the website designers.
    <br>
    For feedback and complains, please write to: 
    <br>
    Feedback@ourmoviewebsite.com 
.</p>
    </div>`
  }
}

const searchBar = document.getElementById('searchBar');
console.log(searchBar)
const searchForm = document.getElementById('searchForm') 
searchForm.addEventListener('submit', (e)=> {
  e.preventDefault()
  inputValue = searchBar.value
  AppSearch.run(inputValue)
})

