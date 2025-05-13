export const getMovies = () => {
    return fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US&include_adult=false&include_video=false&page=1`
    ).then((response) => {
      if (!response.ok)
        throw new Error(`Unable to fetch movies. Response status: ${response.status}`);
      return response.json();
    })
      .catch((error) => {
        throw error
      });
  };
  
  export const getTVSeries = () => {
    return fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US&include_adult=false&include_video=false&page=1`
    ).then((response) => {
      if (!response.ok)
        throw new Error(`Unable to fetch movies. Response status: ${response.status}`);
      return response.json();
    })
      .catch((error) => {
        throw error
      });
  };
  
  export const getMovie = (id: string) => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to get movie data. Response status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      throw error
   });
  };
  
  export const getGenres = () => {
    return fetch(
      "https://api.themoviedb.org/3/genre/movie/list?api_key=" + import.meta.env.VITE_TMDB_KEY + "&language=en-US"
    ).then( (response) => {
      if (!response.ok)
        throw new Error(`Unable to fetch genres. Response status: ${response.status}`);
      return response.json();
    })
    .catch((error) => {
      throw error
   });
  };
  
  export const getMovieImages = (id: string | number) => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}/images?api_key=${import.meta.env.VITE_TMDB_KEY}`
    ).then((response) => {
      if (!response.ok) {
        throw new Error("failed to fetch images");
      }
      return response.json();
    }).then((json) => json.posters)
      .catch((error) => {
        throw error
      });
  };
  
  export const getMovieReviews = (id: string | number) => { //movie id can be string or number
    return fetch(
      `https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${import.meta.env.VITE_TMDB_KEY}`
    )
      .then((res) => res.json())
      .then((json) => {
        // console.log(json.results);
        return json.results;
      });
  };
  export const getMovieUpComing = () => {
        return fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${import.meta.env.VITE_TMDB_KEY}`
        ).then((response) => {
          if (!response.ok)
            throw new Error(`Unable to fetch movies. Response status: ${response.status}`);
          return response.json();
        })
          .catch((error) => {
            throw error
          });
      };
      
      export const getPopularMovie = () => {
        return fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMDB_KEY}`
        ).then((response) => {
          if (!response.ok)
            throw new Error(`Unable to fetch movies. Response status: ${response.status}`);
          return response.json();
        })
          .catch((error) => {
            throw error
          });
      };
      export const getActors = async (pageNumber: number = 1) => {
        const apiKey = import.meta.env.VITE_TMDB_KEY;
        const url = `https://api.themoviedb.org/3/person/popular?api_key=${apiKey}&page=${pageNumber}`;
        
        const response = await fetch(url);
        if (response.status !== 200) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return await response.json();
      };

      export const getActorDetails = async (performerId: string) => {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${performerId}?api_key=${import.meta.env.VITE_TMDB_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`Unable to fetch performer details (HTTP ${response.status})`);
        }
        return await response.json();
      };
      
      export const getActorFilmography = async (performerId: string) => {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${performerId}/movie_credits?api_key=${import.meta.env.VITE_TMDB_KEY}`
        );
        
        const data = await response.json();
        return data.cast || [];
      };

      export const gethActorFilmRoles = async (performerId: string) => {
        const apiKey = import.meta.env.VITE_TMDB_KEY;
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${performerId}/movie_credits?api_key=${apiKey}`
        );
      
        if (!response.ok) {
          throw new Error(`Filmography request failed with status ${response.status}`);
        }
      
        const data = await response.json();
        return data.cast || [];
      };