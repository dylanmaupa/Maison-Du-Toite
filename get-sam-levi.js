const apiKey = process.env.VITE_GEOAPIFY_API_KEY;

async function getCoords() {
    const text = encodeURIComponent("Travel Odyssey, Borrowdale Village, Harare, Zimbabwe");
    const res = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${text}&apiKey=${apiKey}`);
    const data = await res.json();
    console.log(data.features[0].geometry.coordinates);
}

getCoords();
