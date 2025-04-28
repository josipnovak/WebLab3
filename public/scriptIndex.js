let filmovi = [];
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
        filmovi = filmovi.slice(0, 20); 
        console.log(filmovi.slice(0, 20));
        prikaziFilmove(filmovi.slice(0, 20));
    })

function prikaziFilmove(filmovi){
    const tbody = document.querySelector("#filmovi-tablica-index tbody");
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
            `;
            const button = row.querySelector("button");
            tbody.appendChild(row);
        }
    }