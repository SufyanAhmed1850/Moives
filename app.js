(async function () {
    const response = await fetch("./data.json")
    let responseToData = await response.json()
    let data = responseToData.sort(function (a, b) {
        return b.vote_count - a.vote_count;
    });
    const searchBar = document.getElementById("searchBar")
    const applyBtn = document.getElementById("apply")
    const yearOpt = document.getElementById("year")
    const genreOpt = document.getElementById("genre")
    const langOpt = document.getElementById("lang")
    const ratingOpt = document.getElementById("rating")
    const cardContainer = document.getElementById("cardContainer")
    let genres = []
    let years = []
    let languages = []
    let ratings = []
    //-------------------------------------GENRE--------------------------------GENRE-----------------------------------GENRE----------------------------
    data.forEach(function (obj) {
        const objGenres = obj.genres
        if (Array.isArray(objGenres)) {
            objGenres.forEach(function (genre) {
                if (!genres.includes(genre)) {
                    genres.push(genre)
                }
            })
        }
    })
    genres.sort(function (a, b) {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    });
    genres.forEach(function (genre) {
        const optElem = document.createElement("option")
        optElem.innerHTML = genre
        optElem.value = genre
        genreOpt.appendChild(optElem)
    })
    //-------------------------------------GENRE--------------------------------GENRE-----------------------------------GENRE----------------------------
    //--------------------------------------YEAR--------------------------------YEAR------------------------------------YEAR-----------------------------
    data.forEach(function (obj) {
        const releaseYear = obj.release_date.slice(0, 4)
        if (!years.includes(releaseYear)) {
            years.push(releaseYear)
        }
    })
    years.sort(function (a, b) {
        return b - a
    })
    years.forEach(function (year) {
        const optElem = document.createElement("option")
        optElem.innerHTML = year
        optElem.value = year
        yearOpt.appendChild(optElem)
    })
    //--------------------------------------YEAR--------------------------------YEAR------------------------------------YEAR-----------------------------
    //-------------------------------------LANGUAGE-----------------------------LANGUAGE--------------------------------LANGUAGE-------------------------
    data.forEach(function (obj) {
        const language = obj.original_language
        if (!languages.includes(language)) {
            languages.push(language)
        }
    })
    languages.sort(function (a, b) {
        if (a < b) {
            return -1;
        }
        if (a > b) {
            return 1;
        }
        return 0;
    });
    languages.forEach(function (lang) {
        const optElem = document.createElement("option")
        optElem.innerHTML = lang
        optElem.value = lang
        langOpt.appendChild(optElem)
    })
    //-------------------------------------LANGUAGE-----------------------------LANGUAGE--------------------------------LANGUAGE-------------------------
    //-------------------------------------RATINGS------------------------------RATINGS---------------------------------RATINGS--------------------------
    data.forEach(function (obj) {
        const rating = obj.vote_average
        if (!ratings.includes(rating)) {
            ratings.push(rating)
        }
    })
    ratings.sort(function (a, b) {
        return b - a
    })
    ratings.forEach(function (rate) {
        const optElem = document.createElement("option")
        optElem.innerHTML = rate
        optElem.value = rate
        ratingOpt.appendChild(optElem)
    })
    //-------------------------------------RATINGS------------------------------RATINGS---------------------------------RATINGS--------------------------
    //-------------------------------------CARDS--------------------------------CARDS-----------------------------------CARDS----------------------------
    let cardIndex = 0;
    function formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }
    function renderCard(data) {
        cardContainer.innerHTML = "";
        data.forEach(function (obj) {
            const runtime = obj.runtime;
            const formattedRunTime = formatTime(runtime);
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
            <p class="runtime" >${formattedRunTime}</p>
            <img class="card_img" src="https://image.tmdb.org/t/p/w400/${obj.poster_path}">
            <div class="details">
            <p class="dim_txt">${obj.original_language},<span class="yellow"> ${obj.release_date.slice(0, 4)}</span></p>
            <p class="title">${obj.title}</p>
            <div class="imbd_rating">
            <div class="imdbContainer">
                <img class="imdb" src="./images/imdb.svg" alt="">
                <span class="dim_txt">${obj.vote_average}</span>
            </div>
                <span class="dim_txt"><img class="rateCount" src="./images/rateCount.png">${(obj.vote_count / 1000).toFixed(1)}k</span>
            </div>
            <div class="card_genre">${obj.genres}</div>
            </div>`;
            cardContainer.appendChild(card);
        });
        loadMoreBtn.style.display = "none"
    }
    function self() {
        for (let i = cardIndex; i < cardIndex + 30 && i < data.length; i++) {
            const obj = data[i];
            const runtime = obj.runtime
            const formattedRunTime = formatTime(runtime)
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
            <p class="runtime" >${formattedRunTime}</p>
            <img class="card_img" src="https://image.tmdb.org/t/p/w400/${obj.poster_path}">
            <div class="details">
                <p class="dim_txt">${obj.original_language},<span class="yellow"> ${obj.release_date.slice(0, 4)}</span></p>
                <p class="title">${obj.title}</p>
                <div class="imbd_rating">
                <div class="imdbContainer">
                    <img class="imdb" src="./images/imdb.svg" alt="">
                    <span class="dim_txt">${obj.vote_average}</span>
                </div>
                    <span class="dim_txt"><img class="rateCount" src="./images/rateCount.png">${(obj.vote_count / 1000).toFixed(1)}k</span>
                </div>
                <div class="card_genre">${obj.genres}</div>
            </div>`;
            cardContainer.appendChild(card);
        }
        cardIndex += 30
    }
    self()
    const loadMoreBtn = document.getElementById("load-more-btn");
    loadMoreBtn.addEventListener("click", self);
    //-------------------------------------CARDS--------------------------------CARDS-----------------------------------CARDS----------------------------
    //-------------------------------------SEARCH-------------------------------SEARCH----------------------------------SEARCH---------------------------
    function search() {
        const query = searchBar.value.toLowerCase();
        const result = data.filter(function (item) {
            let directorName = "";
            let castName = "";
            for (let i = 0; i < item.directors.length; i++) {
                if (item.directors[i].name.toLowerCase().includes(query)) {
                    directorName = item.directors[i].name;
                    break;
                }
            }
            for (let i = 0; i < item.cast.length; i++) {
                if (item.cast[i].name.toLowerCase().includes(query)) {
                    castName = item.cast[i].name;
                    break;
                }
            }
            return (item.title.toLowerCase().includes(query) || directorName.toLowerCase().includes(query) || castName.toLowerCase().includes(query))
        });
        if (result.length === 0) {
            cardContainer.innerHTML = "";
            console.log("NOT FOUND")
            yearOpt.value = "all"
            genreOpt.value = "all"
            langOpt.value = "all"
            ratingOpt.value = "all"
            loadMoreBtn.style.display = "none"
        }
        else if (query === "") {
            cardContainer.innerHTML = "";
            cardIndex = 0;
            loadMoreBtn.style.display = "block"
            yearOpt.value = "all"
            genreOpt.value = "all"
            langOpt.value = "all"
            ratingOpt.value = "all"
            self();
        } else {
            renderCard(result);
            yearOpt.value = "all"
            genreOpt.value = "all"
            langOpt.value = "all"
            ratingOpt.value = "all"
            loadMoreBtn.style.display = "none"
        }
    }
    //-------------------------------------SEARCH-------------------------------SEARCH----------------------------------SEARCH---------------------------
    //-------------------------------------OPTION-------------------------------OPTION----------------------------------OPTION---------------------------
    function typeSearch() {
        const genreQuery = genreOpt.value.toLowerCase();
        const yearQuery = yearOpt.value.toLowerCase();
        const langQuery = langOpt.value.toLowerCase();
        const ratingQuery = +ratingOpt.value;
        const result = data.filter(function (item) {
            let isGenreMatched = true;
            if (genreQuery && genreQuery !== "all") {
                if (Array.isArray(item.genres)) {
                    isGenreMatched = item.genres.join(" ").toLowerCase().includes(genreQuery);
                } else {
                    isGenreMatched = false;
                }
            }
            let isYearMatched = true;
            if (yearQuery && yearQuery !== "all") {
                isYearMatched = item.release_date.toLowerCase().includes(yearQuery);
            }
            let isLangMatched = true;
            if (langQuery && langQuery !== "all") {
                isLangMatched = item.original_language.toLowerCase().includes(langQuery);
            }
            let isRatingMatched = true;
            if (ratingQuery && ratingQuery !== "all") {
                isRatingMatched = item.vote_average === ratingQuery;
            }
            return isGenreMatched && isYearMatched && isLangMatched && isRatingMatched;
        });
        if (result.length === 0) {
            cardContainer.innerHTML = "No matching results found.";
            loadMoreBtn.style.display = "none";
        } else if (genreOpt.value == "all" && yearOpt.value == "all" && langOpt.value == "all" && ratingOpt.value == "all") {
            cardIndex = 0
            cardContainer.innerHTML = ""
            loadMoreBtn.style.display = "block"
            self()
        }
        else {
            renderCard(result);
        }
        searchBar.value = "";
    }
    //-------------------------------------OPTION-------------------------------OPTION----------------------------------OPTION---------------------------
    searchBar.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            search();
        }
    });
    applyBtn.addEventListener("click", function () {
        typeSearch()
    });
})()