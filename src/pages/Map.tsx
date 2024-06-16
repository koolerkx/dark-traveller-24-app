import { IonContent, IonPage, useIonToast } from "@ionic/react";
import { checkmarkCircle, close } from "ionicons/icons";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useState } from "react";
import MapComponent from "../components/MapComponent";
import { useRepository } from "../contexts/repository";
import { Point } from "../types/point";
import "./Map.css";

const Map: React.FC = () => {
  // const headerTitle = "地圖";
  const [points, setPoints] = useState<Point[]>([]);
  const [present] = useIonToast();

  const { pointRepository } = useRepository();

  useEffect(
    useCallback(() => {
      if (!pointRepository) return;

      pointRepository
        .getPoints()
        .then((data) => {
          setPoints(data);
        })
        .catch((error) => {
          console.error(error);
          present({
            message: "出錯了！無法獲取攻擊點資料。",
            duration: 1500,
            icon: checkmarkCircle,
            position: "bottom",
            color: "warning",
            swipeGesture: "vertical",
            buttons: [
              {
                icon: close,
                role: "cancel",
              },
            ],
          });
        });
    }, [pointRepository]),
    [pointRepository, setPoints]
  );

  return (
    <IonPage>
      {/* <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{headerTitle}</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent fullscreen>
        <MapComponent points={points} />
      </IonContent>
    </IonPage>
  );
};

export default Map;
