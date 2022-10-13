// Initial Values

const searchButton = document.querySelector('#search');
const inputElement = document.querySelector('#inputValue');
const movieSearch = document.querySelector('#movie-search');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const current = document.querySelector('#current');
var movieIdOrg=0;

//Init for paging
var currentPage=1;
var nextPage=2;
var prevPage=3;
var lastUrl='';
var totalPage=100;


//Page up part
function movieSection(movies){
    return movies.map((movie)=>{
        if(movie.poster_path){
            return `<img src =${imageUrl+movie.poster_path} data-movie-id=${movie.id}/>`;
        }
    })
}

//Page bottom part
function moviePoster(movies){
    const movieElement=document.createElement('div');
    movieElement.setAttribute('class','movie');
    const template = `<section class="section">
            ${movieSection(movies)}
        </section>
        <div class ="content">
            <p id="content-close">X</p>
            <p id="fav"></p>
        </div>`;          
    movieElement.innerHTML = template;
    return movieElement;
}

//General function for show movie poster 
function renderMovies(data){
    //Paging
    currentPage=data.page;
    nextPage=currentPage+1;
    console.log('nextPage111: ', nextPage);
    prevPage=currentPage-1;
    totalPage=data.total_pages;

    movieSearch.innerHTML="";
    const movies=data.results;
    const movieBlock= moviePoster(movies);
    movieSearch.appendChild(movieBlock);
    console.log('Data: ', data);
}

//General error function
function generalError(error){
    console.log('Error: '+error);
} 

//Click on search button
searchButton.onclick=function(event){
    event.preventDefault();
    const value =inputElement.value;
    srchMovie(value);
    inputElement.value="";
    console.log('Value: ',value);
}

//Click on any movie poster
document.onclick=function(event){
    console.log('Event',event)
    const target =event.target;

    if(target.tagName.toLowerCase()==='img'){
        const movieId=target.dataset.movieId;
        console.log('Movie id: ',movieId);
        //Movie id without backSlash
        movieIdOrg = movieId.slice(0, -1);  
        const section=event.target.parentElement;
        const content =section.nextElementSibling;
        content.classList.add('content-display');

        const path=`movie/${movieIdOrg}`;
        const forDetailUrl= dynamicUrl(path);
        console.log('forDetailUrl: ',forDetailUrl);

            //Movie details
        fetch(forDetailUrl)
        .then((res)=>res.json())
        .then((data)=>detailsframe(data,content,forDetailUrl))
        .catch((error)=>{
            console.log('Error: ',error)
        });

           
    }
    
    if(target.id==='content-close'){
        const content=target.parentElement;
        content.classList.remove('content-display')
    }
}

//Create bottom Iframe
function creatIframe(datail){
    const iframe=document.createElement('iframe');
    iframe.src=datail;
    iframe.width=300;
    iframe.height=300;
    iframe.allowFullscreen=true;
    return iframe;
}

//Show movie details
function detailsframe(data,content,forDetailUrl){
     //Movie detail
    content.innerHTML="<p id=content-close>X</p>"+"<p1 id=fav><button>Favorite movie</button></p1>";
    fav.onclick=function(event){
        addFav();      
    }
    const iframeContainer=document.createElement('div');
    const iframe = creatIframe(forDetailUrl);
    iframeContainer.appendChild(iframe);
    content.appendChild(iframeContainer);
}



function DropdownList() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }


 //Dropdown - favorite list
    async function getFavoriteList() {
        //For wait Auth
        const sleep = ms => new Promise(res => setTimeout(res, ms));

        //For get Request token
        const responseReqToken = await fetch("https://api.themoviedb.org/3/authentication/token/new?api_key="+API_KEY);
        var data = await responseReqToken.json();
       
        //User Authentication
        authWin=window.open(`https://www.themoviedb.org/authenticate/${data.request_token}/allow`);
        await sleep(50);
        authWin.close();
        
        //For get Session ID
        const responseSessionID = await fetch("https://api.themoviedb.org/3/authentication/session/new?api_key="+API_KEY+`&request_token=${data.request_token}`);
        var dataSessionID = await responseSessionID.json();

        //For get Account ID
        const responseAccountId = await fetch(`https://api.themoviedb.org/3/account?api_key=`+API_KEY+`&session_id=${dataSessionID.session_id}`)
        var dataAccountId = await responseAccountId.json();

        reqMovie(`https://api.themoviedb.org/3/account/${dataAccountId.id}/favorite/movies?api_key=`+API_KEY+`&session_id=${dataSessionID.session_id}&language=en-US&sort_by=created_at.asc&page=1`,renderMovies,generalError);   
    }


    async function addFav() {      
        //For wait Auth
        const sleep = ms => new Promise(res => setTimeout(res, ms));

        //For get Request token
        const responseReqToken = await fetch("https://api.themoviedb.org/3/authentication/token/new?api_key="+API_KEY);
        var data = await responseReqToken.json();
       
        //User Authentication
        authWin=window.open(`https://www.themoviedb.org/authenticate/${data.request_token}/allow`);
        await sleep(50);
        authWin.close();
        
        //For get Session ID
        const responseSessionID = await fetch("https://api.themoviedb.org/3/authentication/session/new?api_key="+API_KEY+`&request_token=${data.request_token}`);
        var dataSessionID = await responseSessionID.json();

        //For get Account ID
        const responseAccountId = await fetch(`https://api.themoviedb.org/3/account?api_key=`+API_KEY+`&session_id=${dataSessionID.session_id}`)
        var dataAccountId = await responseAccountId.json();

        const dataPost = { 
            "media_type": "movie",
            "media_id": movieIdOrg,
            "favorite": true
          };

        fetch(`https://api.themoviedb.org/3/account/${dataAccountId.id}/favorite?api_key=2c46288716a18fb7aadcc2a801f3fc6b&session_id=${dataSessionID.session_id}`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataPost),
        })
            .then((response) => response.json())
            .then((dataPost) => {
                console.log('Success:', dataPost);
            })
            .catch((error) => {
                console.error('Error:', error);
            }); 
    }

    function searchbarClicked() {
        document.getElementById('searchbar').value = '';
    }


popularMovie();

  