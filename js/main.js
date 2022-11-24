"use strict";
const baseURL = "https://restcountries.com/v2";

// ------------------ ALL COUNTRIES --------------------------- //
const getAllCountries = async () => {
    const countries = await fetch(`${baseURL}/all`);
    const result = await countries.json();
    dataRender(result)
    dynamicCategory(result)
}

getAllCountries()

// ------------------- ALL COUNTRIES END ----------------------- //



// ------------------- RENDER ALL DATA ----------------------- //

function dataRender(data = []) {

    data.forEach((el) => {

        const card = createElement('div', 'card shadow-lg', `
        <img src="${el.flags.svg ? el.flags.svg : "https://picsum.photos/id/122/267/160"}" alt="flag" class="card-top-img">
        <div class="card-body p-4">
        <h3 class="card-title">${el.name}</h3>
        <ul class="card-list p-0">
        <li class="card-list-item list-unstyled"><strong>Population: </strong> ${el.population} </li>
        <li class="card-list-item list-unstyled"><strong>Region: </strong> ${el.region} </li>
        <li class="card-list-item list-unstyled"><strong>Capital: </strong> ${el.capital} </li>
        </ul>
        <button class="btn btn-primary mt-4" data-id="${el.name}">READ MORE . . .</button>
        </div>`);

        $(".wrapper").appendChild(card);

    })
}

// ------------ RENDER ALL DATA END ----------------------- //


// -------------- dynamicCategory ----------------- //

function dynamicCategory(data) {

    const category = [];

    data.forEach((el) => {
        if (!category.includes(el.region)) {
            category.push(el.region)
        }
    })

    category.sort()
    category.unshift('All');
    category.forEach((el) => {
        const option = createElement('option', 'item', el);
        $('#region').appendChild(option)
    })
}

// -------------- dynamicCategory END ----------------- //

$("#search").addEventListener('keypress', (e) => {
    if (e.target.value.trim().length !== 0 && e.keyCode === 13) {
        $('.wrapper').innerHTML = `<span class="loader"></span>`;
        setTimeout(() => {
            $('.wrapper').innerHTML = "";
            findCountry(e.target.value);
        }, 1500)

    }
})

// -------------------- FIND COUNTRIES ----------------- //

async function findCountry(country) {

    $('.wrapper').innerHTML = "";
    const response = await fetch(`${baseURL}/name/${country}`);

    const data = await response.json();
    if (response.status === 404) {
        $('.info').innerHTML = "<h1 class='text-center w-100 mb-5'>Please enter the name of country</h1>"
    } else {
        $('.info').innerHTML = `<h1 class='text-center w-100 mb-5'>Countries found: ${data.length}</h1>`;
        dataRender(data)
    }
}

// ------------------- FIND COUNTRIES END ------------------- //

$('#region').addEventListener('change', (e) => {
    $('.wrapper').innerHTML = `<span class="loader"></span>`;

    setTimeout(() => {
        $('.wrapper').innerHTML = ""
        sortCountry(e.target.value.toLowerCase())
    }, 1500)
})


async function sortCountry(region) {
    $('.wrapper').innerHTML = "";
    if (region === "all") {
        const response = await fetch(`${baseURL}/all`);

        const data = await response.json();

        if (response.status === 404) {
            $('.info').innerHTML = "<h1 class='text-center w-100'>Please enter the name of country</h1>"
        } else {

            $('.info').innerHTML = `<h1 class='text-center w-100 mb-5'>Countries found: ${data.length}</h1>`;
            dataRender(data)
        }
    } else {
        const response = await fetch(`${baseURL}/region/${region}`);

        const data = await response.json();

        if (response.status === 404) {
            $('.info').innerHTML = "<h1 class='text-center w-100'>Please enter the name of country</h1>"
        } else {
            $('.info').innerHTML = `<h1 class='text-center w-100 mb-5'>Countries found: ${data.length}</h1>`;
            dataRender(data)
        }
    }
}


$('.wrapper').addEventListener('click', (e) => {
    $('.country-info').innerHTML = "";
    
    if (e.target.classList.contains('btn-primary')) {
        let id = e.target.getAttribute('data-id');
        getCountry(id);
        $('.sidebar').classList.remove('swipe')
        $('body').style.overflow = `hidden`;
    }
})


async function getCountry(country) {

    const response = await fetch(`${baseURL}/name/${country}`);
    const result = await response.json();

    const {
        name,
        capital,
        region,
        population,
        area,
        timezones,
        flags: {
            svg
        }
    } = result[0];

    const row = createElement('div', 'row', `
    
    <div class="col-md-4 p-3">
       <img src="${svg}" alt="rasm" id="img-country" width="320">
    </div>
    <div class="col-md-7 p-3">
       <ul class="list-group">
          <li class="list-group-item" id="cName">Country: ${name}</li>
          <li class="list-group-item">Capital: ${capital}</li>
          <li class="list-group-item">Area: ${area}</li>
          <li class="list-group-item">Population: ${population}</li>
          <li class="list-group-item">Region: ${region}</li>
          <li class="list-group-item">Timezone: ${timezones}</li>   
       </ul>
    </div>`);

    $('.country-info').appendChild(row);
}

$('.close').addEventListener('click', () => {
    $('.sidebar').classList.add('swipe')
    $('body').style.overflow = `visible`;
})




