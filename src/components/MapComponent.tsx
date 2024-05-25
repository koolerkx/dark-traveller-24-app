import type { GeoJsonObject } from "geojson";
import { Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import "./MapComponent.css";
import { useIonToast } from "@ionic/react";

interface ContainerProps {}

const MapComponent: React.FC<ContainerProps> = () => {
  const [map, setMap] = useState<Map | null>(null);
  const [cycleTrackData, setCycleTrackData] = useState<GeoJsonObject | null>(
    null
  );
  const [present] = useIonToast();

  const latitude = 22.461944;
  const longitude = 114.001504;
  // const cycleURL =
  //   "https://api.csdi.gov.hk/apim/dataquery/api/?id=td_rcd_1629267205229_68005&layer=cyctrack&bbox-crs=WGS84&bbox=113.8,22.1,114.7,23.0&limit=10000&offset=0";
  const cycleURL = "/json/cycleTrack.json";

  useEffect(() => {
    fetch(cycleURL)
      .then((response) => response.json())
      .then((data) => setCycleTrackData(data))
      .catch((e: unknown) => {
        present({
          message: "有些地方出錯了！",
          duration: 1500,
          position: "bottom",
          color: "warning",
        });
      });
  }, []);

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

      {!!cycleTrackData ? (
        <GeoJSON
          data={cycleTrackData}
          pathOptions={{
            color: "#cb1a27",
          }}
        />
      ) : null}
    </MapContainer>
  );
};

export default MapComponent;
