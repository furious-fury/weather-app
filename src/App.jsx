import Forecast from './components/Forecast'
import Inputs from './components/Inputs'
import TempAndDetails from './components/TempAndDetails'
import TimeAndLocation from './components/TimeAndLocation'
import TopButtons from './components/TopButtons'
import getFormattedWeatherData from './services/weatherService'
import {useEffect, useState} from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const[query, setQuery] = useState({q: 'warri'})
  const[units, setUnits] = useState('metric')
  const[weather, setWeather] = useState(null)

  useEffect(() => {
    const message = query.q ? query.q : 'Current Location';

    const fetchWeather = async () =>{
      const data = await getFormattedWeatherData({...query, units}).then((data) => {

        toast.success(`Weather for ${message} fetched successfully`)
        setWeather(data)
      })
    }

    fetchWeather();
  }, [query, units])
  
  const formatBackground = () => {
    if(!weather) return 'from-cyan-700 to-blue-700'
      const threshold = units === 'metric' ? 20 : 60;
      if(weather.temp <= threshold) return 'from-cyan-700 to-blue-700'

        return 'from-yellow-700 to-orange-700'
  }

  return (
    <div className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}>
      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits}/>

      {weather && (
        <>
      <TimeAndLocation weather={weather}/>
      <TempAndDetails weather={weather}/>
      <Forecast title='hourly forecast' items={weather.hourly}/>
      <Forecast title='daily forecast' items={weather.daily}/>
        </>
      )}

      <ToastContainer autoClose={5000} theme='colored' newestOnTop={true}/>

    </div>
  )
}

export default App
