const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const movies = require("./movies.js");
const app = express();

app.set("views", path.join(__dirname, "views"));

app.engine("handlebars", exphbs({
	defaultLayout: "main",
	layoutsDir: path.join(__dirname, "views/layout")
}));

app.set("view engine", "handlebars");

app.use(express.static(path.join(__dirname,"public")));

app.get("/", (req, res) => {
	res.render("home");
});

//get of UL..
app.get("/movie-list", (req, res) => {
	movies.getAllMovies(movieList => {
		if (movieList) {
			res.render("movie-list", {movies: movieList});
		} else {
				res.render("error",({msg:"En este momento no se puede consultar las películas"}));
		}
	});
});

//get of OL..
app.get("/movie-list/:sort", (req, res) => {
	movies.getAllMovies(movieList => {
		if (movieList) {
			movies.getSortedMovies(req.params.sort, movieList, orderedList => {
				// I realize an if for each type of sorting, because i need to see the differences of the sorts and then i can render it on the view "movie-list"

				if (req.params.sort == "sort-by-name-asc"){
					res.render("movie-list", {movies: orderedList, sortByNameAsc:"sortByNameAsc"});
					return;
				}

				if (req.params.sort == "sort-by-name-desc"){
					res.render("movie-list", {movies: orderedList, sortByNameDesc:"sortByNameDesc"});
					return;
				}

				if (req.params.sort == "sort-by-year-asc"){
					res.render("movie-list", {movies: orderedList, sortByYearAsc:"sortByYearAsc"});
					return;
				}

				if (req.params.sort == "sort-by-year-desc"){
					res.render("movie-list", { movies: orderedList, sortByYearDesc:"sortByYearDesc" });
					return;
				}
			});

		} else {
				res.render("error", { msg:"En este momento no se puede realizar la consulta las películas," });
		}
	});
});

//get of the movie..
app.get("/movie-detail/:id", (req, res) => {
	movies.getMovieById(req.params.id, movie => {
		if (movie) {
			res.render("movie-detail", { movie });
		} else {
				res.render("error", {msg:"En este momento no se puede consultar los datos de esta película" })
		}
	});
});

app.listen(3000, () => {
	console.log(`Server iniciado en http://localhost:${3000}`);
});