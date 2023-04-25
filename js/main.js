let apiData;

//串接API
fetch("https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-4102BF5A-AF9A-458A-B880-17CC9E8372A4&format=JSON")
    .then(response => {
        return response.json();
    })
    .then(function getData(data) {
        apiData = data;
    })
    .catch(error => {
        console.error(error);
    });

//監聽HTML
const dropBoxCity = document.querySelector("#city");
const cityDefaultOption = city.querySelector('option[value="default"]');
const cardTitle = document.querySelector(".card-title");
const cardFeel = document.querySelector(".card-text-feel");
const cardTemp = document.querySelector(".card-text-temp");
const cardRain = document.querySelector(".card-text-rain");
const weatherIcon = document.querySelector(".weather-icon");


const cityList = [];

setTimeout(function () {
    if (apiData) {
        console.log(apiData);
        apiData.records.location.forEach(location => {
            cityList.push(location);
        });
        dropBoxCity.innerHTML = `<option value="default" disabled selected>請選擇區域</option>`;
        cityList.forEach(function (city) {
            const cityName = city.locationName;
            console.log(city.weatherElement[0].time[1].parameter.parameterName);
            dropBoxCity.innerHTML += `<option>${cityName}</option>`;
        });

        console.log(cityList);


    } else {
        console.error("time out");
    }
}, 1000);

dropBoxCity.addEventListener("change", function () {
    const selected = this.options[this.selectedIndex].value;
    console.log(selected);
    const selectedData = apiData.records.location.filter(function (location) {
        if (location.locationName === selected) {
            return location;
        }
    });

    cardTitle.textContent = selectedData[0].locationName;
    //取出
    cardFeel.textContent = selectedData[0].weatherElement[0].time[0].parameter.parameterName;

    cardTemp.textContent = selectedData[0].weatherElement[2].time[0].parameter.parameterName + "-" + selectedData[0].weatherElement[4].time[0].parameter.parameterName + "°C";
    cardRain.textContent = "降雨機率：" + selectedData[0].weatherElement[1].time[0].parameter.parameterName + "%";

    const parameterValue = parseInt(selectedData[0].weatherElement[0].time[0].parameter.parameterValue);
    if (parameterValue < 3) {
        weatherIcon.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    } else if (parameterValue > 8) {
        weatherIcon.innerHTML = `<i class="fa-solid fa-cloud"></i>`;
    } else {
        weatherIcon.innerHTML = `<i class="fa-solid fa-cloud-rain"></i>`;
    }
});

