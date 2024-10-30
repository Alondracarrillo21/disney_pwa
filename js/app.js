const apiUrl = "http://localhost:3000/movies"; // URL de la API

// Función para obtener y mostrar las películas
async function fetchMoviesFromAPI() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error al obtener las películas: ${response.statusText}`);
        }
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error("Error al traer las películas del servidor:", error);
        alert("No se pudieron cargar las películas. Intenta de nuevo más tarde.");
    }
}

// Función para mostrar las películas en el DOM
function displayMovies(movies) {
    const movieContainer = document.getElementById("characters");
    movieContainer.innerHTML = "";
    movies.forEach((movie) => {
        const formattedReleaseDate = new Date(movie.release_date).toISOString().split('T')[0];

        const card = `
            <div class="col-md-4 mb-4" id="movie-${movie.id}">
                <div class="card">
                    <img src="http://localhost:3000/uploads/${movie.image}" class="card-img-top" alt="${movie.name}">
                    <div class="card-body">
                        <h5 class="card-title">${movie.name}</h5>
                        <p class="card-text"><strong>Fecha de Estreno:</strong> ${formattedReleaseDate}</p>
                        <div class="d-flex justify-content-around">
                            <button class="btn btn-danger" onclick="confirmDeleteMovie(${movie.id})">Eliminar</button>
                            <button class="btn btn-primary" onclick="loadMovieData(${movie.id})" data-toggle="modal" data-target="#updateCharacterModal">Actualizar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        movieContainer.insertAdjacentHTML("beforeend", card);
    });
}

// Función para agregar una nueva película (POST)
async function addMovieToAPI(movieData) {
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            body: movieData,
        });

        if (!response.ok) {
            throw new Error(`Error al agregar la película: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Película agregada:", result);
        fetchMoviesFromAPI();
    } catch (error) {
        console.error("Error al agregar la película:", error);
        alert("No se pudo agregar la película. Verifica los datos e intenta de nuevo.");
    }
}

// Manejo del envío del formulario para agregar películas
document.getElementById('character-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('release_date', document.getElementById('birthDate').value);
    formData.append('image', document.getElementById('img').files[0]);

    addMovieToAPI(formData);
    $('#characterModal').modal('hide');
});

// Función para eliminar una película (DELETE)
async function deleteMovieFromAPI(movieId) {
    try {
        const response = await fetch(`${apiUrl}/${movieId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error(`Error al eliminar la película: ${response.statusText}`);
        }

        const result = await response.text();
        console.log("Película eliminada:", result);
        document.getElementById(`movie-${movieId}`).remove();
    } catch (error) {
        console.error("Error al eliminar la película:", error);
        alert("No se pudo eliminar la película. Intenta de nuevo.");
    }
}

// Función para confirmar eliminación de película
function confirmDeleteMovie(movieId) {
    $('#deleteConfirmModal').modal('show');

    document.getElementById('confirm-delete-btn').onclick = function () {
        deleteMovieFromAPI(movieId);
        $('#deleteConfirmModal').modal('hide');
    };
}

// Función para cargar los datos de la película en el modal de actualización
async function loadMovieData(movieId) {
    console.log(`Cargando datos para la película ID: ${movieId}`);
    try {
        const response = await fetch(`${apiUrl}/${movieId}`);
        if (!response.ok) {
            throw new Error(`Error al obtener los datos de la película con ID ${movieId}: ${response.statusText}`);
        }

        const movie = await response.json();
        document.getElementById('updateCharacterName').value = movie.name;
        document.getElementById('updateCharacterBirthDate').value = new Date(movie.release_date).toISOString().split('T')[0];
        document.getElementById('updateCharacterForm').onsubmit = function (event) {
            event.preventDefault();
            updateMovieInAPI(movieId);
        };

        // Mostrar el modal
        $('#updateCharacterModal').modal('show');
    } catch (error) {
        console.error("Error al cargar los datos de la película:", error);
        alert("No se pudieron cargar los datos de la película. Intenta de nuevo.");
    }
}


// Función para actualizar una película en la API 
async function updateMovieInAPI(movieId) {
    const formData = new FormData();
    formData.append('name', document.getElementById('updateCharacterName').value);
    formData.append('release_date', document.getElementById('updateCharacterBirthDate').value);
    
    if (document.getElementById('updateCharacterImg').files.length > 0) {
        formData.append('image', document.getElementById('updateCharacterImg').files[0]);
    }

    try {
        const response = await fetch(`${apiUrl}/${movieId}`, {
            method: "PUT",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar la película: ${response.statusText}`);
        }

        const result = await response.text();
        console.log("Película actualizada:", result);
        fetchMoviesFromAPI(); // Refresca la lista de películas
        $('#updateCharacterModal').modal('hide'); // Cierra el modal
    } catch (error) {
        console.error("Error al actualizar la película:", error);
        alert("No se pudo actualizar la película. Verifica los datos e intenta de nuevo.");
    }
}


// Llamar a fetchMoviesFromAPI al cargar la página
document.addEventListener('DOMContentLoaded', fetchMoviesFromAPI);
