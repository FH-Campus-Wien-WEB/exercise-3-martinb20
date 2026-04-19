
// Fetch genres and build the navigation buttons
function loadGenres() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/genres");
    
    xhr.onload = function () {
        if (xhr.status === 200) {
            const genres = JSON.parse(xhr.responseText);
            const nav = document.getElementById("genre-nav");

            // 1. Create the 'All' button first
            const allBtn = document.createElement("button");
            allBtn.textContent = "All";
            allBtn.onclick = () => loadMovies("All");
            nav.appendChild(allBtn);

            // 2. Loop through the genres and create specific buttons
            genres.forEach(genre => {
                const btn = document.createElement("button");
                btn.textContent = genre;
                btn.onclick = () => loadMovies(genre);
                nav.appendChild(btn);
            });

            // 3. Click the 'All' button automatically to load the initial movies
            allBtn.click();
        }
    };
    xhr.send();
}

// Fetch and render movies based on genre
function loadMovies(genre = 'All') {
    const xhr = new XMLHttpRequest();
    
    // Add query parameter to the URL if a specific genre is chosen
    let url = "/movies";
    if (genre !== "All") {
        url += "?genre=" + encodeURIComponent(genre);
    }

    xhr.open("GET", url);
    xhr.onload = function () {
        const mainElement = document.getElementById("movie-container");
        mainElement.innerHTML = ''; // Clear previous movies
        
        if (xhr.status === 200) {
            const movies = JSON.parse(xhr.responseText);

          
            movies.forEach(movie => {
                const article = document.createElement("article");
                article.id = movie.imdbID; 
                
                const title = document.createElement("h2");
                title.textContent = movie.Title;
                
                const poster = document.createElement("img");
                poster.src = movie.Poster;
                poster.alt = movie.Title + " Poster";
                
                const genresContainer = document.createElement("div");
                movie.Genres.forEach(genreName => {
                    const span = document.createElement("span");
                    span.className = "genre"; 
                    span.textContent = genreName;
                    genresContainer.appendChild(span);
                });

                const details = document.createElement("p");
                details.innerHTML = `<strong>Released:</strong> ${movie.Released} | <strong>Runtime:</strong> ${movie.Runtime} mins | <strong>Metascore:</strong> ${movie.Metascore} | <strong>IMDB:</strong> ${movie.imdbRating}`;
                
                const crew = document.createElement("p");
                crew.innerHTML = `<strong>Directors:</strong> ${movie.Directors.join(', ')} <br> <strong>Writers:</strong> ${movie.Writers.join(', ')} <br> <strong>Actors:</strong> ${movie.Actors.join(', ')}`;

                const plot = document.createElement("p");
                plot.textContent = movie.Plot;

                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";
                editBtn.className = "edit-btn"; 
                editBtn.onclick = function() {
                    location.href = 'edit.html?imdbID=' + movie.imdbID;
                };

                article.append(title, poster, genresContainer, details, crew, plot, editBtn);
                
                // Append the complete article to the <main> element
                mainElement.appendChild(article);
            });

        } else {
            mainElement.append("Daten konnten nicht geladen werden, Status " + xhr.status + " - " + xhr.statusText);
        }
    }
    xhr.send();
}

// Start the sequence when the page loads
window.onload = loadGenres;