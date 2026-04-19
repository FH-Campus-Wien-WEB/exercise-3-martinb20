// Function to populate the form fields with existing movie data
function setMovie(movie) {
  for (const element of document.forms[0].elements) {
    const name = element.id;
    if (!name) continue; // Skip elements that don't have an ID (like buttons)

    const value = movie[name];

    if (name === "Genres") {
      const options = element.options;
      for (let index = 0; index < options.length; index++) {
        const option = options[index];
        // Select the option if it exists in the movie's genre array
        option.selected = value && value.indexOf(option.value) >= 0;
      }
    } else if (name === "Actors" || name === "Directors" || name === "Writers") {
      // Convert arrays back to cleanly spaced comma-separated strings
      element.value = value ? value.join(", ") : "";
    } else if (value !== undefined) {
      element.value = value;
    }
  }
}

// Function to pull data out of the form and format it into a JSON object
function getMovie() {
  const movie = {};
  const elements = Array.from(document.forms[0].elements).filter(element => element.id);

  for (const element of elements) {
    const name = element.id;
    let value;

    if (name === "Genres") {
      value = [];
      const options = element.options;
      for (let index = 0; index < options.length; index++) {
        const option = options[index];
        if (option.selected) {
          value.push(option.value);
        }
      }
    } else if (name === "Metascore" || name === "Runtime" || name === "imdbRating") {
      value = Number(element.value); // Ensure numbers are saved as Numbers, not Strings
    } else if (name === "Actors" || name === "Directors" || name === "Writers") {
      // Convert the comma-separated string back into an array
      value = element.value.split(",").map(item => item.trim());
    } else {
      value = element.value;
    }

    movie[name] = value;
  }

  return movie;
}

// Function to send the updated movie data back to the server
function putMovie() {
  const movieData = getMovie();
  const imdbID = movieData.imdbID;

  const xhr = new XMLHttpRequest();
  
  xhr.onload = function () {
    // Handle 200 (OK), 204 (No Content), and 201 (Created)
    if (xhr.status == 200 || xhr.status === 201 || xhr.status === 204) {
      location.href = "index.html"; // Go back to the main page on success
    } else {
      alert("Saving of movie data failed. Status code was " + xhr.status);
    }
  };

  xhr.open("PUT", "/movies/" + imdbID);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(JSON.stringify(movieData));
}

// --- ON PAGE LOAD SCRIPT --- 
// Get the imdbID from the URL (e.g., ?imdbID=tt0068646)
const urlParams = new URLSearchParams(window.location.search);
const currentImdbID = urlParams.get("imdbID");

if (currentImdbID) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "/movies/" + currentImdbID);
  xhr.onload = function () {
    if (xhr.status === 200) {
      setMovie(JSON.parse(xhr.responseText));
    } else {
      alert("Loading of movie data failed. Status was " + xhr.status + " - " + xhr.statusText);
    }
  };
  xhr.send();
}