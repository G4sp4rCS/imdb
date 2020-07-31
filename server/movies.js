const mongodb = require("mongodb");
const mongoURL = "mongodb+srv://admin:admin@cluster0-4a4p0.mongodb.net/test";

const getAllMovies = (cbResult) => {
	mongodb.MongoClient.connect(mongoURL , { useUnifiedTopology: true },(error, client) => {
		if (error) {	
			cbResult(undefined);
			client.close();
		} else {
				const projectDB = client.db("Movie-Project");
				const movieCollection = projectDB.collection("movies");

				movieCollection.find().toArray((error, movieList) => {

					if(error) {
						cbResult(undefined)
					} else {
							cbResult(movieList);
					}

					client.close();
				});
		}
	});
}

const getMovieById = (filteredId, cbResult) => {
	mongodb.MongoClient.connect( mongoURL,{ useUnifiedTopology: true }, (err, client) => {
		if (err) {
			cbResult(undefined);
		} else {
				const projectDB = client.db("Movie-Project");
				const movieCollection = projectDB.collection("movies");

				movieCollection.findOne({id : parseInt(filteredId)},(error,foundMovie) => {

					if (error) {
						cbResult(undefined)						
					} else if (!foundMovie){
							cbResult(undefined)
					} else {							
							cbResult(foundMovie);
					}
					
					client.close();
			});
		}
	});
}

/** 
 * @param {string} sortCategory | es el stringParam que recibo del lado del servidor.
 * @param {Array} movieList 
 * @param {function} cbResult 
 * Función que recibe un array con la lista de películas, y las ordena según el criterio que 
 se le pase como parámetro. Al final ejecuta la función callback pasándole la lista ordenada como parametro.
 */
const getSortedMovies = (sortCategory, movieList, cbResult) => {
	let orderedList;

	if (sortCategory == "sort-by-name-asc") {
		orderedList = movieList.sort((a, b) => {
			if (a.title < b.title) return -1; 
		});
	}
	
	if (sortCategory == "sort-by-name-desc") {
		orderedList = movieList.sort((a, b) => {
		 	if (a.title > b.title) return -1; 
	 	});
	}

	if (sortCategory == "sort-by-year-asc") {
		orderedList = movieList.sort((a, b) => {
	 		if (a.year < b.year) return -1; 
		});
	}

	if (sortCategory == "sort-by-year-desc") {
		orderedList = movieList.sort((a, b) => {
	 		if (a.year > b.year) return -1; 
		});
	}

		cbResult(orderedList);
}

module.exports = { getAllMovies , getMovieById, getSortedMovies };