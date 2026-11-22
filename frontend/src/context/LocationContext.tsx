import React, { createContext, useContext, useState, useEffect } from 'react';
import { CitySearchResult, AirQualityResponse } from '../types';
import { api } from '../services/api';

interface LocationContextType {
  currentCity: string;
  latitude: number;
  longitude: number;
  airQualityData: AirQualityResponse | null;
  isLoadingAqi: boolean;
  setCity: (city: CitySearchResult) => void;
  setCoordinates: (name: string, lat: number, lon: number) => void;
  detectLocation: () => void;
  refreshAqi: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCity, setCurrentCity] = useState<string>('Jamshedpur');
  const [latitude, setLatitude] = useState<number>(22.8046);
  const [longitude, setLongitude] = useState<number>(86.2029);
  const [airQualityData, setAirQualityData] = useState<AirQualityResponse | null>({
    locationName: 'Jamshedpur',
    country: 'India',
    latitude: 22.8046,
    longitude: 86.2029,
    aqi: 133,
    aqiCategory: 'Poor',
    aqiColor: '#E67E22',
    dominantPollutant: 'PM2.5',
    temperature: 22,
    humidity: 88,
    windSpeed: 3.6,
    windDirection: 'NW',
    weatherDescription: 'Haze',
    uvIndex: 0,
    pm25: 48,
    pm10: 63,
    recordedAt: '2026-11-22 23:51:01',
    source: 'AQI.IN Live National Atmospheric Sensor Network',
    pollutants: [
      { code: 'PM2.5', name: 'Fine Particulate Matter', value: 48, unit: 'µg/m³', status: 'Poor', color: '#E67E22', description: 'Fine inhalable particles <2.5µm from combustion & industrial smog.', whoGuideline: 15 },
      { code: 'PM10', name: 'Coarse Particulate Matter', value: 63, unit: 'µg/m³', status: 'Moderate', color: '#D97706', description: 'Respirable coarse particles from road dust & industry.', whoGuideline: 45 },
      { code: 'NO₂', name: 'Nitrogen Dioxide', value: 38.4, unit: 'µg/m³', status: 'Moderate', color: '#2E8B57', description: 'Vehicular exhaust & industrial emissions.', whoGuideline: 25 },
      { code: 'O₃', name: 'Ground-Level Ozone', value: 28, unit: 'µg/m³', status: 'Good', color: '#2E8B57', description: 'Secondary photochemical oxidant.', whoGuideline: 100 },
      { code: 'CO', name: 'Carbon Monoxide', value: 380, unit: 'µg/m³', status: 'Normal', color: '#2E8B57', description: 'Combustion gas from fossil fuel.', whoGuideline: 4000 },
      { code: 'SO₂', name: 'Sulphur Dioxide', value: 62, unit: 'µg/m³', status: 'Good', color: '#2E8B57', description: 'Industrial coal & furnace oil emission.', whoGuideline: 40 },
    ],
    hourlyTrend: [
      { time: '00:00', aqi: 117, pm25: 43.0, pm10: 55.7 },
      { time: '04:00', aqi: 117, pm25: 43.0, pm10: 55.7 },
      { time: '08:00', aqi: 133, pm25: 48.0, pm10: 63.0 },
      { time: '12:00', aqi: 145, pm25: 53.4, pm10: 69.1 },
      { time: '16:00', aqi: 145, pm25: 53.4, pm10: 69.1 },
      { time: '20:00', aqi: 133, pm25: 48.0, pm10: 63.0 },
    ],
    forecast: [
      { day: 'Today', date: 'Nov 23', aqi: 133, category: 'Poor', color: '#E67E22', maxTemp: 26, minTemp: 14, summary: 'Moderate smog' },
      { day: 'TUE', date: 'Nov 24', aqi: 140, category: 'Poor', color: '#E67E22', maxTemp: 25, minTemp: 15, summary: 'Moderate smog' },
      { day: 'WED', date: 'Nov 25', aqi: 125, category: 'Poor', color: '#E67E22', maxTemp: 24, minTemp: 14, summary: 'Moderate smog' },
    ],
    healthAdvisory: {
      generalMessage: 'Members of sensitive groups may experience health effects.',
      sensitiveGroupsMessage: 'Children, elderly, and individuals with asthma should reduce prolonged exertion.',
      maskGuidance: 'N95 recommended near highways and arterial roads',
      windowVentilation: 'Brief flush (10-15 min) between 1:00 PM and 3:30 PM only',
      outdoorExercise: 'Limit intense cardio; shift to brisk walking'
    },
    outdoorSafety: {
      running: { status: 'CAUTION', advice: 'Reduce training intensity. Avoid early morning cold smog.', recommendedTime: '13:00 - 15:30' },
      cycling: { status: 'CAUTION', advice: 'Wear an anti-pollution N95 mask if riding over 30 mins.', recommendedTime: 'Afternoon' },
      walking: { status: 'SAFE', advice: 'Brisk walking is fine; avoid high-traffic corridors.', recommendedTime: '12:00 - 16:00' },
      childrenAndSeniors: { status: 'NOT_RECOMMENDED', advice: 'Limit recess and playground time to under 20 mins.', recommendedTime: 'Midday only' }
    }
  });
  const [isLoadingAqi, setIsLoadingAqi] = useState<boolean>(false);

  const fetchAqi = async (city: string, lat: number, lon: number) => {
    setIsLoadingAqi(true);
    try {
      const data = await api.getAirQuality(city, lat, lon);
      setAirQualityData(data);
    } catch (e) {
      console.error('Failed to load AQI', e);
    } finally {
      setIsLoadingAqi(false);
    }
  };

  useEffect(() => {
    fetchAqi(currentCity, latitude, longitude);
  }, [currentCity, latitude, longitude]);

  const setCity = (city: CitySearchResult) => {
    setCurrentCity(city.name);
    setLatitude(city.latitude);
    setLongitude(city.longitude);
  };

  const setCoordinates = (name: string, lat: number, lon: number) => {
    setCurrentCity(name);
    setLatitude(lat);
    setLongitude(lon);
  };

  const detectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates('Current Coordinates', pos.coords.latitude, pos.coords.longitude);
        },
        (err) => {
          console.warn('Geolocation denied or unavailable', err);
        }
      );
    }
  };

  return (
    <LocationContext.Provider value={{
      currentCity,
      latitude,
      longitude,
      airQualityData,
      isLoadingAqi,
      setCity,
      setCoordinates,
      detectLocation,
      refreshAqi: () => fetchAqi(currentCity, latitude, longitude),
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within a LocationProvider');
  return context;
};
