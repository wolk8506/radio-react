import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import weatherImage from './weatherIcon';
import MapUpdater from './MapUpdater';

export default function WeatherMap({ latitude, longitude, temp, condition, icon, address }) {
  const iconWeather = weatherImage(icon, 1);
  const combinedIcon = new L.DivIcon({
    html: `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: center;
      font-weight: bold;
      color: #222;
    ">
      <img src="${iconWeather}" style="width: 40px; height: 40px;" />
      <span style="margin-top: 4px; font-size: 14px;">${temp}°C</span>
    </div>
  `,
    className: 'combined-weather-icon',
  });
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={10}
      scrollWheelZoom={false}
      style={{ height: '270px', width: '620px', borderRadius: '20px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <MapUpdater latitude={latitude} longitude={longitude} />

      <Marker position={[latitude, longitude]} icon={combinedIcon}>
        <Popup>
          <strong>{address}</strong>
          <br />
          <strong>{condition}</strong> <br />
          Температура: {temp}°C
        </Popup>
      </Marker>
    </MapContainer>
  );
}
