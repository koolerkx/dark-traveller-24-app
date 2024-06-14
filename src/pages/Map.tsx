import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "leaflet/dist/leaflet.css";
import MapComponent from "../components/MapComponent";
import "./Map.css";

const Map: React.FC = () => {
  // const headerTitle = "地圖";

  return (
    <IonPage>
      {/* <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{headerTitle}</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent fullscreen>
        <MapComponent />
      </IonContent>
    </IonPage>
  );
};

export default Map;
