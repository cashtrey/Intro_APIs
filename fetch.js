let url = 'https://api.wheretheiss.at/v1/satellites/25544'

let issLat = document.querySelector('#iss-lat')
let issLong = document.querySelector('#iss-long')

let date = document.querySelector('#date')

let update = 10000
let maxFailAttemps = 3

let issMarker
let issIcon = L.icon({
    iconUrl: 'issIcon.png',
    iconSize: [50, 50],
    iconAnchor: [25, 25]
})

let map = L.map('iss-map').setView([0, 0], 1)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

iss(maxFailAttemps)
date.innerHTML = Date()
// setInterval(iss, update)

function iss(attempts) {

    if (attempts <= 0) {
        alert('Attempts to contact server failed')
        return
    }

    fetch(url).then((res) => {
        return res.json()
    }).then((issData) => {
        console.log(issData)
        let lat = issData.latitude
        let long = issData.longitude
        issLat.innerHTML = lat
        issLong.innerHTML = long
        date.innerHTML = Date()

        if (!issMarker) {
            issMarker = L.marker([lat, long], {icon: issIcon} ).addTo(map)
        }
        else {
            issMarker.setLatLng([lat, long])
        }

    }).catch((err) => {
        attempts --
        console.log('ERROR', err)
    }).finally( () => {
        setTimeout(iss, update, attempts)
    })
}