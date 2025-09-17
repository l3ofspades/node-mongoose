const connect = require("./db");

const { Objectid } = require("mongodb");


const runDatabaseQueries = async () => {
  
  const db = await connect();
  const movies = db.collection("movies");
  const users = db.collection("users");
  const comments = db.collection("comments");



  //Create Task: Add a new user
await users.insertOne({ name: "Jonathan Federico", email: "jonathanfederico13@gmail.com" });
console.log("Created new user");

// Read Task 1: Nolan Movies
const nolanMovies = await movies.find({ director: "Christopher Nolan" });
console.log("Nolan Movies:", nolanMovies);

//Read Task 2: Action Movies sorted by years
const actionMovies = await movies.find({ genres: "Action" })
.sort({ year: -1 })
.toArray();
console.log("Action Movies:", actionMovies);

//Read Task 3: Movies IMDB > 8 (title + imdb only)
const imdb8Movies = await movies.find({"imdb.rating": {gt: 8} })
.project({ title: 1, imdb: 1, _id: 0 })
.toArray();
console.log("Movies IMDb > 8:", imdb8Movies);

//Read Task 4: Movies starring Tom Hanks and Tim Allen
const hanksAllen = await movies.find({ cast: { $all: ["Tom Hanks", "Tim Allen"] } }).toArray();
console.log("Movies starring Tom Hanks and Tim Allen:", hanksAllen);

//Read Task 5: Movies starring ONLY Tom Hanks and Tim Allen
const hanksAllenOnly = await movies.find({ cast: { $all: ["Tom Hanks", "Tim Allen"], $size: 2 } }).toArray();
console.log("Movies starring ONLY Tom Hanks and Tim Allen:", hanksAllenOnly);

// Read Task 6: Comedy movies directed by Steven Spielberg
const spielbergComedy = await movies.find({ director: "Steven Spielberg", genres: "Comedy" }).toArray();
console.log("Comedy movies directed by Steven Spielberg:",spielbergComedy);

//Update Task 1: Add available_on: "Sflix" to The Matrix
await movies.updateOne({ title: "The Matrix" }, { $set: { available_on: "Sflix" } });
console.log("Added availble_on: Sflix to the Matrix");

//Update Task 2: Increment Metacritic of The Matrix by 1
await movies.updateOne({ title: "The Matrix" }, { $inc: { metacritic: 1 } });
console.log("Incremented Metacritic of The Matrix by 1");

// Update Task 3: Add genre  "Gen Z" to all 1997 movies
await movies.updateMany({ uear: 1997 }, { $addToSet: { genres: "Gen Z"} });
console.log('Added genre "Gen Z" to 1997 movies');

// Update task 4: Increase IMdb rating by 1 for movies with rating < 5
await movies.updateMany({ "imdb.rating": { $lt: 5 } }, { $inc: { "imdb.rating": 1 } });
console.log("Increased IMDB rating by 1 for movies with rating < 5");

//Delete Task 1: Delete comment by specific ID (replace with real ID)
//Example: const commentID = "put_real_id_here"
//await comments.deleteOne({ _id: new ObjectId(commentId) });

// Delete Task 2: Delete all comments for the Matrix
await comments.deleteMany({ movie_title: "The Matrix" });
console.log("Deleted all comments for the Matrix");

//Delete Task 3: Delete all movies without genres
await movies.deleteMany({ genres: { $exist: true, $size: 0 } });
console.log("Deleted all movies without genres");

//Aggregate Task 1: Count movies released per year
const moviesPerYear = await movies.aggregate([
  { $group: { _id: "$year", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
]).toArray();
console.log("Movies per year:", moviesPerYear);

// Aggregate Task 2: Average IMDb rating per director (desc)
const avgRatingPerDirector = await movies.aggregate([
  { $group: { _id: "director", avgRating: { $avg: "imdb.rating" } } },
  { $sort: { avgRating: -1 } }
]).toArray();
console.log("Average IMDb rating per director:", avgRatingPerDirector);

  process.exit(0);
};


runDatabaseQueries();