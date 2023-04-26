let url = 'https://api.wheretheiss.at/v1/satellites/25544' // url for the api

let issLat = document.querySelector('#iss-lat') // setting up all my variables, finding their ids in html
let issLong = document.querySelector('#iss-long')

let date = document.querySelector('#date')

let update = 10000 // milliseconds before page reloads
let maxFailAttemps = 3

let issMarker
let issIcon = L.icon({ // custom icon
    iconUrl: 'issIcon.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25]
})

let map = L.map('iss-map').setView([0, 0], 1) // new map, very large view

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map); // same tile layer used last lab

iss(maxFailAttemps) // runs iss at page launch
// date.innerHTML = Date() -- I realized this was useless
// setInterval(iss, update)

function iss(attempts) {

    if (attempts <= 0) { // if function fails three times it stops running
        alert('Attempts to contact server failed')
        return
    }

    fetch(url).then((res) => { // calls out to api
        return res.json() // response should be json
    }).then((issData) => {
        console.log(issData)
        let lat = issData.latitude // sets our variables to the lat/long from the api
        let long = issData.longitude
        issLat.innerHTML = lat // makes the html reflect such
        issLong.innerHTML = long
        date.innerHTML = Date() // date is set to current date/time

        if (!issMarker) { // if no marker
            issMarker = L.marker([lat, long], {icon: issIcon} ).addTo(map) // creates marker at spot of iss with the custom icon
        }
        else {
            issMarker.setLatLng([lat, long]) // if there is a marker, set it to updated coordinates
        }

    }).catch((err) => {
        attempts -- // reduces attempts
        console.log('ERROR', err) // gives error in console
    }).finally( () => {
        setTimeout(iss, update, attempts) // runs again after certain period of time, assuming attempts > 0
    })
}