const API_KEY="2c46288716a18fb7aadcc2a801f3fc6b"
const url="https://api.themoviedb.org/3/search/movie?api_key=2c46288716a18fb7aadcc2a801f3fc6b"
const imageUrl = 'https://image.tmdb.org/t/p/w500';

//Generate Dynamic URL
function dynamicUrl(path){
    const url=`https://api.themoviedb.org/3/${path}?api_key=2c46288716a18fb7aadcc2a801f3fc6b`;
    return url;
}

//Request
function reqMovie(url,complete,error){
    lastUrl=url;
    fetch(url)
        .then((res)=>res.json())
        .then(complete)
        .catch(error);
}

//Search Movie function
function srchMovie(value){
    const path= "search/movie";
    const forSearchUrl= dynamicUrl(path) + '&query=' + value;
    reqMovie(forSearchUrl,renderMovies,generalError);   
}

//Popular Movie list
function popularMovie(value){
    const path= "discover/movie";
    const forSearchUrl= dynamicUrl(path) + '&sort_by=popularity.desc';
    reqMovie(forSearchUrl,renderMovies,generalError);   
}

 //screening Movie list
function screeningMovie(){
    const path= "movie/now_playing";
    const forSearchUrl= dynamicUrl(path);
    reqMovie(forSearchUrl,renderMovies,generalError);   
}


