import React, { useState,useEffect } from 'react';
import FiveDayForecast from './FiveDayForecast';

const api = {
  key: '2d30c3e73e49e18ea4a898ddee275115',
  base: 'https://api.openweathermap.org/data/2.5/',
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [backgroundClass, setBackgroundClass] = useState('app');
  const [fiveDayList, setFiveDayList] = useState({});
  
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'api.openweathermap.org/data/2.5',
      'X-RapidAPI-Key': '2d30c3e73e49e18ea4a898ddee275115',
    },
  };
  useEffect(()=>{
    if(query!==''){
      setFiveDayList({})
    }
  },[query])
  const search = (evt) => {
    if (evt.key === 'Enter') {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then((res) => res.json())
        .then((result) => {
          setQuery('');
          if (result.cod !== '404') {
            setWeather(result);
            setBackgroundClass(`app ${result.weather[0].main}`);
          } else {
            alert(`Invalid location!`);
          }
        });
      fetch(
        `https://${options.headers['X-RapidAPI-Host']}/forecast?q=${query}&appid=${options.headers['X-RapidAPI-Key']}`
      )
        .then((response) => response.json())
        .then((response) => {
          if (response.cod !== '404') {
            setFiveDayList(response.list);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const dateBuilder = (d) => {
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    let days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    let day = days[d.getDay()];
    let date = d.getDate() > 9 ? d.getDate() : `0${d.getDate()}`;
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date}, ${month}, ${year}`;
  };

  return (
    <div className={backgroundClass}>
      <main>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyPress={search}
          />
        </div>
        {typeof weather.main != 'undefined' ? (
          <div id='weather-data-containter'>
            <div className="location-box">
              <div className="location">
                {weather.name}, {weather.sys.country}
              </div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">{Math.round(weather.main.temp)}°c</div>
              <div className="weather">{weather.weather[0].main}</div>
            </div>
          </div>
        ) : (
          ''
        )}
        <section>
          <button
            id="five-days"
            className="five-day-forecast"
            type="button"
            onClick={() => {
              let fiveDays = document.getElementById('DaysForecast');
              if (fiveDays) {
                let toggleDisplay =
               ( document.getElementById('DaysForecast').style.display === 'none' || !document.getElementById('DaysForecast').style.display)
                  ? 'flex'
                  : 'none' || 'flex';
                  fiveDays.style.display = toggleDisplay;
              }
            }}
          >
            Get 5 day forecast
          </button>
          <FiveDayForecast daysList={fiveDayList} />
        </section>
      </main>
    </div>
  );
}

export default App;
