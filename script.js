// A toi de jouer pour cette partie :-) Happy coding ! Merci ;-)

const myButton = document.getElementById("city-button");
const cityInput = document.getElementById("cityInput");
const details = document.getElementById("details");
const temperature = document.getElementById("temperature");
const cityDOM = document.getElementById("city");

async function fetchCoordinates(city) {
  let res;
  const url = `https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&limit=1`;
  try {
    res = await fetch(url);
  } catch (error) {
    throw new Error("Error in geocoding");
  }

  const data = await res.json();

  return data;
}

async function handleCitySearch() {
  try {
    const city = cityInput.value;
    const data = await fetchCoordinates(city);
    if (!data || data.length === 0) {
      cityDOM.innerText = "Ville non trouvée";
      return;
    }
    details.innerText = `Coordonnées GPS : Lat: ${data[0].lat}, Lon: ${data[0].lon}`;

    let capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);

    cityDOM.innerText = `${capitalizedCity}`;

    let latCoordinates = parseFloat(data[0].lat).toFixed(2);
    let lonCoordinates = parseFloat(data[0].lon).toFixed(2);

    await fetchWeather(latCoordinates, lonCoordinates);
  } catch (error) {
    cityDOM.innerText = "Ville non trouvée";
    console.error(error);
  }
}

async function fetchWeather(latCoordinates, lonCoordinates) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latCoordinates}&longitude=${lonCoordinates}&current=temperature_2m,precipitation,relative_humidity_2m`;

  let res;

  try {
    res = await fetch(url);
  } catch (error) {
    throw new Error("Error in geocoding");
  }

  const data = await res.json();

  console.log("data.current :", data.current);

  temperature.innerText = `${data.current.temperature_2m}°C\nHumidité: ${data.current.relative_humidity_2m}\nPrécipitations : ${data.current.precipitation} mm`;
}

myButton.addEventListener("click", handleCitySearch);
cityInput.addEventListener("keydown", async (e) => {
  if (e.code === "Enter") {
    handleCitySearch();
  }
});
