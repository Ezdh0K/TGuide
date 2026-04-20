const axios = require('axios');

async function fetchPlacesOSM(query) {
    url='https://nominatim.openstreetmap.org/search',
    const { data } = await axios.get(url, {
        params: {
            q: query,
            limit: 50, 
            format: jsonv2,
            addressdetails: 1,
            countrycodes: 'ru'
        },
        headers: {
            'User-Agent': 'TGuide (contact: c0nterdash@gmail.com)',
            'Accept-Language': 'ru',
        },
        timeout = 10000,
    });

    return data.items || [];
}

async function fetchPlacesGoogle() {
    url = '';
    const { data } = await axios.get(url, {
        params: {},
        headers: {},
        timeout: 10000
    });
}

moduls.exports = { fetchPlacesOSM, fetchPlacesGoogle };