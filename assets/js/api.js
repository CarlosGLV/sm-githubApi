const formulario = document.querySelector('#finder');

const loader = document.querySelector('.loader');
const resultado = document.querySelector('.result');


// Listeners
document.addEventListener('DOMContentLoaded', () => {
	formulario.addEventListener('submit', (e) => {
		validarBusqueda(e);
	});
});


// Funciones
function validarBusqueda(e) {
	e.preventDefault();
	// Validamos que este relleno el único campo del form
	const busqueda = document.querySelector('#busqueda');
	if(!busqueda.value) {
		busqueda.classList.add('error');
		return;
	} else {
		busqueda.classList.remove('error');
		consultarAPI(busqueda.value);
	}
}

function consultarAPI(busqueda) {
	// API
	const endpoint = 'https://api.github.com/search/repositories';
	const params = {
        page: 1,
        per_page: 10,
		sort: 'stars',
		order: 'desc'
    }
	const url = endpoint + '?q=' + busqueda + '&page=' + params.page + '&per_page=' + params.per_page + '&sort=' + params.sort + '&order=' + params.order;

	limpiarResultados();
	loader.classList.add('active');

	// Una vez "limpio", llamamos a la api
	fetch(url)
        .then( (response) => {
            return response.json();
        })
        .then( (data) => {
			if(data.total_count === 0) { // La api devuelve total_count: 0 cuando no hay resultados de búsqueda
				loader.classList.remove('active');
				mostrarAlerta('<p>No hay resultados de búsqueda</p>'); // Llamamos a la función "reutilizable" mostrarAlerta();
				return;
			} else {
				loader.classList.remove('active');
				const ul = document.createElement('ul');
				resultado.appendChild(ul);
				data.items.forEach( (item) => {
					const { name, description, owner, git_url } = item;
					const li = document.createElement('li');
					li.innerHTML = '<img src="' + owner.avatar_url + '" width="50" height="50" alt="' + name + '" />' +
								'<h2>' + name + '</h2>' +
								'<h3>' + description + '</h3>' +
								'<p>' + git_url + '</p>'
								;
					ul.appendChild(li);
				});
			}
        })
        .catch( (error) =>  {
			mostrarAlerta('<p>No conecta con la API</p>');
        });
}

function mostrarAlerta(msg) {
    const divAlert = document.querySelector('.alert')
    if( !divAlert ) {
        const divAlert = document.createElement('div');
        divAlert.classList.add('alert');
        divAlert.innerHTML = msg;
        formulario.appendChild(divAlert);
		// Desaparece a los 3 seg
        setTimeout(() => {
            divAlert.remove();
        }, 3000);
    }
}

function limpiarResultados() {
	// Bucle para limpiar todas la entradas
	while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

