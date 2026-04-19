const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/
app.get('/genres', function (req, res) {
  const genresSet = new Set();
  
  // Object.values converts your dictionary into an array of movie objects
  Object.values(movieModel).forEach(movie => {
    movie.Genres.forEach(genre => genresSet.add(genre));
  });

  // Convert the Set back to an array, sort it, and send it as JSON
  res.json(Array.from(genresSet).sort());
});

/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre.
   (If no genre is given, it returns all movies!)
 */
app.get('/movies', function (req, res) {
  const requestedGenre = req.query.genre; // Look for '?genre=...' in the URL
  let moviesArray = Object.values(movieModel);

  // If a genre was requested, filter the array before sending it
  if (requestedGenre) {
    moviesArray = moviesArray.filter(movie => movie.Genres.includes(requestedGenre));
  }

  res.json(moviesArray); 
});

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const id = req.params.imdbID
  const exists = id in movieModel
 
  if (exists) {
    res.send(movieModel[id])
  } else {
    res.sendStatus(404)    
  }
})

app.put('/movies/:imdbID', function(req, res) {
  const id = req.params.imdbID
  const exists = id in movieModel

  movieModel[req.params.imdbID] = req.body;
  
  if (!exists) {
    res.status(201)
    res.send(req.body)
  } else {
    res.sendStatus(200)
  }
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")