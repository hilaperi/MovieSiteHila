next.onclick=function(){
    if(nextPage <= totalPage){
    console.log("nextPage: ",nextPage);
    pageCall(+nextPage);
    current.innerText = +nextPage;

    }
  }


prev.onclick=function(){
    if(prevPage > 0){
    var nextPage1=--nextPage;
    pageCall(nextPage-1);
    console.log("prevPage: ",nextPage-1);
    current.innerText=--nextPage;
    }
}

function reqMovieForPaging(path){   
    reqMovie(path,renderMovies,generalError); 
    return path;
}

function pageCall(page){
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length -1].split('=');
    if(key[0] != 'page'){
        let url = lastUrl + '&page='+page
        reqMovieForPaging(url);

      }else{
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length -1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] +'?'+ b
        console.log("nextPageurl: ",url);
        reqMovieForPaging(url);
      }

}
