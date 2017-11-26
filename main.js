'use script';
const form = document.getElementById('global-form');

form.addEventListener('submit', searchMovies);

form.addEventListener('input', searchMovies);

function searchMovies(event) {
  // Set value input
  let input = document.getElementById('search-input').value.toLowerCase();
  // Call our request
  getMovies(
    'GET',
    `https://api.themoviedb.org/3/search/movie?api_key=2f54589e7291be847fb969102f1c9bc5&language=en-US&query=${
      input
    }&include_adult=true`,
  )
    .then(response => {
      // Parse result on request
      const output = JSON.parse(response);
      const data = output.results;
      const containerMovies = document.getElementById('container-movies');

      addMoviesList(data, input, containerMovies);
      showPopUp(data, containerMovies);
    })

    .catch(error => console.log(error));
}

function addMoviesList(data, input, containerMovies) {
  let content = '';
  // Loop filtering items
  for (let i = 0; i < data.length; i++) {
    // Search movies
    if (data[i].title.indexOf(input)) {
      content += ` 
        <div class="col-md-4">
          <div class="movies-block text-center">
              ${
                data[i].poster_path != null
                  ? `<img class="movies-img" data-item="${
                      i
                    }" src="https://image.tmdb.org/t/p/w150${
                      data[i].poster_path
                    }" alt="Alt">`
                  : `<img  class="movies-img" data-item="${
                      i
                    }"src="http://via.placeholder.com/150x225" alt="Alt" > `
              } 
            <div class="card-block">
              <h4 class="card-title">${data[i].title}</h4>
            </div>
          </div>
      </div>`;
      // Add movies block to page
      containerMovies.innerHTML = content;
    }
  }

  return containerMovies;
}

function slideMovieItems() {}

function showPopUp(data, containerMovies) {
  const imgCollection = document.querySelectorAll('.movies-img');
  let outputPopup = '';
  const popUp = document.querySelector('.movies-popup-block');

  containerMovies.onclick = function(event) {
    const attr = event.target.getAttribute('data-item');
    const showPopUp = document.getElementById('movie-popup');

    for (let i = 0; i < imgCollection.length; i++) {
      if (attr == i) {
        outputPopup = `
              <div class="col-md-4">
                <div class="movie-popup-img">
                
                  ${
                    data[i].poster_path != null
                      ? `<img class="popup-img" data-item="${
                          i
                        }" src="https://image.tmdb.org/t/p/w150${
                          data[i].poster_path
                        }" alt="Alt">`
                      : `<img class="popup-img" data-item="${
                          i
                        }" src="http://via.placeholder.com/150x225" alt="Alt" > `
                  } 
                </div>
              </div>

              <div class="col-md-8">
                  <span class="close-btn">X</span>
                <header class="movies-popup-title">
                  <h1>${data[i].title}</h1>
                </header>
                <div class="movies-popup-descriptions">
                ${
                  data[i].overview != ''
                    ? `<p>${data[i].overview} </p>`
                    : `<p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Illum totam dolorum earum beatae in qui reprehenderit soluta exercitationem voluptas amet, alias eaque rem, cumque natus ullam obcaecati, voluptatibus itaque fugiat.Temporibus dolorem cumque neque reprehenderit aliquid a numquam voluptatem ad explicabo cupiditate quisquam, quia obcaecati minus distinctio officiis repudiandae quae consequatur illo aliquam illum accusantium? Natus maxime temporibus inventore itaque.</p> `
                } 
                </div>
              </div>`;

        // add content to POP UP
        popUp.innerHTML = outputPopup;

        // show popup
        showPopUp.classList.add('active');
        showPopUp.classList.remove('hidden');

        closePopUp(showPopUp, popUp);

        // remove scroll
        document.body.style.overflowY = 'hidden';
      }
    }
  };
}

function closePopUp(showPopUp, popUp) {
  const closeBtn = document.querySelector('.close-btn');
  // close popUp
  closeBtn.onclick = function(e) {
    showPopUp.classList.remove('active');
    showPopUp.classList.add('hidden');
    document.body.style.overflowY = '';
  };

  showPopUp.onclick = function(e) {
    const showPopUp = document.getElementById('movie-popup');
    if (e.target == showPopUp) {
      showPopUp.classList.remove('active');
      showPopUp.classList.add('hidden');
      document.body.style.overflowY = '';
    }
  };
}

function getMovies(method, url) {
  return new Promise((resolve, reject) => {
    // Set Ajax request
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    // Add event to our Ajax
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(this.response);
      } else {
        reject({
          status: this.status,
          statusText: this.statusText,
        });
      }
    };
    // Error event
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: this.statusText,
      });
    };

    // Send our request
    xhr.send();
  });
}
