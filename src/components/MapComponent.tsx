import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "./MapComponent.css";
import "leaflet/dist/leaflet.css";
import { Map } from "leaflet";

interface ContainerProps {}

const MapComponent: React.FC<ContainerProps> = () => {
  const [map, setMap] = useState<Map | null>(null);

  const latitude = 22.461944;
  const longitude = 114.001504;

  // https://github.com/PaulLeCam/react-leaflet/issues/1052#issuecomment-1832647862
  useEffect(() => {
    if (!map) return;

    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }, [map]);

  // https://portal.csdi.gov.hk/csdi-webpage/apidoc/MapLabelAPI;jsessionid=A1E5F54A87E6020B5C52EFAE42CD46DD
  return (
    // Make sure you set the height and width of the map container otherwise the map won't show
    <MapContainer
      center={[latitude, longitude]}
      zoom={16}
      className="map-container"
      ref={(ref) => setMap(ref)}
    >
      <TileLayer
        attribution='<a href="https://api.portal.hkmapservice.gov.hk/disclaimer" target="_blank" class="copyrightDiv">&copy; Map infortmation from Lands Department</a><div style="width:28px;height:28px;display:inline-flex;background:url(https://api.hkmapservice.gov.hk/mapapi/landsdlogo.jpg);background-size:28px;"></div>'
        url="https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/basemap/wgs84/{z}/{x}/{y}.png"
      />
      <TileLayer url="https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/label/hk/tc/wgs84/{z}/{x}/{y}.png" />
      {/* <ComponentResize /> */}
      <Marker position={[latitude, longitude]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
