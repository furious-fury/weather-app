import { DateTime } from "luxon";

const APIKEY = import.meta.env.VITE_API_KEY
const BASEURL = import.meta.env.VITE_BASE_URL

const getWeatherData = (infotype, searchParams) => {
    const url = new URL(BASEURL + '/' + infotype)

    url.search = new URLSearchParams({...searchParams, appid: APIKEY})

    return fetch(url)
    .then((res) => res.json())
}

const formatCurrentWeather = (data) => {
    const {
        coord: {lon, lat},
        main: {temp, feels_like, temp_min, temp_max, humidity},
        name,
        dt,
        sys: {sunrise, sunset, country},
        weather,
        wind: {speed},
    } = data

    const {main: details, icon} = weather[0]

    return {lat, lon, temp, feels_like, temp_min, temp_max, humidity, name, dt, sunrise, sunset, country, details, icon, speed}
}

const formatForecastWeather = (data) => {

    let {timezone, daily, hourly} = data

    daily = daily.slice(1, 6).map(d =>{
        return{
            title: formatToLocalTime(d.dt, timezone, 'ccc'),
            temp: d.temp.day,
            icon: d.weather[0].icon,
        }
    })
    hourly = hourly.slice(1, 6).map(d =>{
        return{
            title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),
            temp: d.temp,
            icon: d.weather[0].icon,
        }
    })

    return {timezone, daily, hourly}
}

const getFormattedWeatherData = async (searchParams) => {
    const formattedCurrentWeather = await getWeatherData('weather', searchParams).then(formatCurrentWeather)

    const {lat, lon} = formattedCurrentWeather
    const formattedForecastWeather = await getWeatherData('onecall', {
        lat, 
        lon, 
        exclude: 'current,minutely,alerts', 
        units:searchParams.units
    }).then(formatForecastWeather)

    return {...formattedCurrentWeather, ...formattedForecastWeather}
}

const formatToLocalTime = (
    secs, 
    zone, 
    format = "cccc, dd LLL yyyy'|'hh:mm a") => DateTime.fromSeconds(secs).setZone(zone).toFormat(format)

const IconUrl = (icon) => `http://openweathermap.org/img/wn/${icon}@2x.png`

export default getFormattedWeatherData

export {formatToLocalTime, IconUrl}