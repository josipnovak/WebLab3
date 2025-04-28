let filmovi = [];
let kosarica = [];
fetch("filmovi.csv")
    .then(response => response.text())
    .then(csv => {
        const rezultat = Papa.parse(csv, {
            header: true,
            skipEmptyLines: true,
        })
        filmovi = rezultat.data.map(film => ({
            title: film.title,
            year: Number(film.year),
            genre: film.genre ? film.genre.split(";").map(genre => genre.trim()) : [],
            duration: Number(film.duration),
            rating: Number(film.avg_vote),
            country: film.country ? film.country.split(";").map(country => country.trim()) : [],
        }));
        filmovi = filmovi.slice(0, 30); 
        console.log(filmovi.slice(0, 30));
        prikaziFilmove(filmovi.slice(0, 30));
    })

function prikaziFilmove(filmovi){
    const tbody = document.querySelector("#filmovi-tablica tbody");
    tbody.innerHTML = "";
    for(const film of filmovi){
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${film.title}</td>
            <td>${film.year}</td>
            <td>${film.genre.join(", ")}</td>
            <td>${film.duration}</td>
            <td>${film.rating}</td>
            <td>${film.country.join(", ")}</td>
            <td><button>+</button></td>
            `;
            const button = row.querySelector("button");
            button.className = "dodaj-button";
            button.addEventListener("click", function(){
                dodajUKosaricu(film);
            });
            tbody.appendChild(row);
        }
    }
    
    function prikaziFiltriraneFilmove(filmovi){
        const tbody = document.querySelector("#filmovi-tablica tbody");
        tbody.innerHTML = "";
        if(filmovi.length === 0){
            tbody.innerHTML = "<tr><td colspan='6'>Nema filmova koji odgovaraju filtrima.</td></tr>";
            return;
        }
        for(const film of filmovi){
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${film.title}</td>
            <td>${film.year}</td>
            <td>${film.genre.join(", ")}</td>
            <td>${film.duration}</td>
            <td>${film.rating}</td>
            <td>${film.country.join(", ")}</td>
            <td><button>+</button></td>
            `;
            const button = row.querySelector("button");
            button.className = "dodaj-button";
            button.addEventListener("click", function(){
                dodajUKosaricu(film);
            });
            tbody.appendChild(row);
        }
}

function filtriraj(){
    const zanr = document.getElementById("filter-genre").value.trim().toLowerCase();
    const godina = parseInt(document.getElementById("filter-year").value);
    const zemlja = document.getElementById("filter-country").value.trim().toLowerCase();
    const ocjena = parseFloat(document.getElementById("filter-rating").value);

    const filtiraniFilmovi = filmovi.filter(film =>{
        const zanrMatch = !zanr || film.genre.some(g => g.toLowerCase().includes(zanr));
        const godinaMatch = !godina || film.year >= godina;
        const zemljaMatch = !zemlja || film.country.some(c => c.toLowerCase().includes(zemlja));
        const ocjenaMatch = !ocjena || film.rating >= ocjena;
        return zanrMatch && godinaMatch && zemljaMatch && ocjenaMatch;
    })
    prikaziFiltriraneFilmove(filtiraniFilmovi.slice(0, 30));
}


function dodajUKosaricu(film){
    if(!kosarica.includes(film)){
        kosarica.push(film);
        osvjeziKosaricu();
    }
    else{
        alert("Film je već u košarici.");
    }
}

function osvjeziKosaricu(){
    const lista = document.getElementById("lista-kosarice");
    lista.innerHTML = "";
    kosarica.forEach((film, index) => {
        const li = document.createElement("li");
        li.className = "kosarica-item";
        li.textContent = `${film.title}`;
        const ukloniButton = document.createElement("button");
        ukloniButton.className= "trash-button";
        const icon = document.createElement("i");
        icon.className = "fas fa-trash";
        ukloniButton.appendChild(icon);
        ukloniButton.addEventListener("click", function(){
            ukloniIzKosarice(index);
        });
        li.appendChild(ukloniButton);
        lista.appendChild(li);
    })
}

function ukloniIzKosarice(index){
    kosarica.splice(index, 1);
    osvjeziKosaricu();
}

window.addEventListener('DOMContentLoaded', function() {
    const rangeInput = document.getElementById("filter-rating");
    const ratingDisplay = document.getElementById('rating-value');
    rangeInput.addEventListener('input', function(){
        ratingDisplay.textContent = rangeInput.value;
    });
   
    const filterButton = document.getElementById("primijeni-filtere");
    filterButton.addEventListener("click", function(){
        filtriraj();
    });

    document.getElementById('toggle-kosarica').addEventListener('click', function () {
        const kosarica = document.getElementById('kosarica');
        if (kosarica.style.display === 'none' || kosarica.style.display === '') {
            kosarica.style.display = 'block';
        } else {
            kosarica.style.display = 'none';
        }
    });

    document.getElementById("potvrdi-kosaricu").addEventListener("click", function(){
        if(kosarica.length === 0){
            alert("Košarica je prazna.");
        }
        else{
            alert(`Uspješno ste naručili sljedeće filmove:\n${kosarica.map(film => film.title).join(", ")}`);
            kosarica = [];
            osvjeziKosaricu();
        }
    });
});

