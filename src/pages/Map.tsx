import {
  IonContent,
  IonPage,
  useIonModal,
  useIonToast,
  useIonViewDidEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { checkmarkCircle, close } from "ionicons/icons";
import "leaflet/dist/leaflet.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import MapComponent from "../components/MapComponent";
import MapPointModal from "../components/MapPointModal";
import { useRepository } from "../contexts/repository";
import { PointWithStatus } from "../repository/point";
import "./Map.css";
import { useFirebase } from "../contexts/firebase";
import { logEvent } from "firebase/analytics";

const Map: React.FC = () => {
  // const headerTitle = "地圖";
  const [points, setPoints] = useState<PointWithStatus[]>([]);
  const [presentToast] = useIonToast();

  const [selectedPoint, setSelectedPoint] = useState<PointWithStatus | null>(
    null
  );

  const { pointRepository } = useRepository();

  const [presentModal, dismissModal] = useIonModal(MapPointModal, {
    point: selectedPoint,
  });

  const { analytics } = useFirebase();

  useIonViewDidEnter(() => {
    presentModal({
      initialBreakpoint: 0.2,
      breakpoints: [0.2, 0.6],
      backdropDismiss: false,
      backdropBreakpoint: 0.2,
      canDismiss: true,
    });

    if (analytics)
      logEvent(analytics, "view", {
        page: "login",
      });
  });

  useIonViewWillLeave(() => {
    dismissModal();
  });

  const onMarkerClick = useCallback(
    (point: PointWithStatus) => {
      if (analytics)
        logEvent(analytics, "map_marker_clicked", {
          pointId: point.id,
          pointName: point.point,
        });

      setSelectedPoint(point);
    },
    [setSelectedPoint]
  );

  useEffect(
    useCallback(() => {
      if (!pointRepository) return;

      pointRepository
        .getPointsWithCapturedInfo()
        .then((data) => {
          setPoints(data);
          if (data.length > 0) {
            setSelectedPoint(data[0]);
          }
        })
        .catch((error) => {
          console.error(error);
          presentToast({
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
        <MapComponent points={points} onMarkerClick={onMarkerClick} />
      </IonContent>
    </IonPage>
  );
};

export default Map;
