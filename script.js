const baseWeatherAPIURL = "http://api.weatherapi.com/v1";
const endPoints = {
  currentWeather: "/current.json",
  history: "/history.json",
};
const APIKey = "038f40e08a834fe2bb7135709221812";
const queryParameter = ["Egypt", "London", "Paris"];
const historicalDaysPeriod = 4;
const baseDate = new Date();
const date = {
  currentYear: baseDate.getFullYear(),
  currentMonth: baseDate.getUTCMonth() + 1,
  currentDay: baseDate.getDate(),
};
const countriesParentDiv = document.getElementById("countries-parent");
const popUp = document.getElementById("country-historical");
const countryHistoryName = document.getElementById("country-historical-name");
const countryHistoryParentDiv = document.getElementById(
  "country-historical-values"
);
const countryCards = document.getElementsByClassName("country-card");

document.addEventListener("click", (e) => {
  const isClosed =
    e.target.closest(".countries-parent") ||
    e.target.closest(".country-historical");
  isClosed ? null : (popUp.style.display = "none");
});

const getCurrentWeather = async (country) => {
  const data = await fetch(
    baseWeatherAPIURL + `${endPoints.currentWeather}?key=${APIKey}&q=${country}`
  );
  response = await data.json();
  return response;
};

const getHistoricalWeather = async (country, year, month, day) => {
  const data = await fetch(
    baseWeatherAPIURL +
      `${endPoints.history}?key=${APIKey}&q=${country}&dt=${year}-${month}-${day}`
  );
  response = await data.json();
  popUp.style.display = "block";
  return [
    response.forecast.forecastday[0].date,
    response.forecast.forecastday[0].day.avgtemp_c,
  ];
};

for (const country of queryParameter) {
  getCurrentWeather(country).then((data) => {
    countryCard(data.location.name, data.current.temp_c);
  });
}

const countryCard = (countryName, temp) => {
  const countryCardElement = document.createElement("div");
  countryCardElement.classList.add("country-card");
  countryCardElement.innerHTML = `
                              <h3>${countryName}</h3>
                              <p>${temp} <span>c</span></p>
      `;
  countryCardElement.addEventListener("click", async () => {
    countryHistoryParentDiv.innerHTML = "";
    for (let day = 0; day < 4; day++) {
      await getHistoricalWeather(
        countryName,
        date.currentYear,
        date.currentMonth,
        date.currentDay - day
      ).then((data) => {
        countryHistoryCard(countryName, new Date(data[0]), data[1]);
      });
    }
  });
  countriesParentDiv.appendChild(countryCardElement);
};

const countryHistoryCard = (countryName, date, temp) => {
  const countryHistoryCardElement = document.createElement("div");
  countryHistoryCardElement.classList.add("country-historical-value");
  countryHistoryCardElement.innerHTML = `
                                    <h4>${date.getDate()}, ${date.toLocaleString(
    "default",
    { month: "short" }
  )}, ${date.getFullYear()}</h4>
                                    <p>${temp} <span>c</span></p>
      `;
  countryHistoryName.innerHTML = `<h3>${countryName}</h3>`;
  countryHistoryParentDiv.appendChild(countryHistoryCardElement);
};
