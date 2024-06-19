import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import "./Home.css";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";
import { useCallback, useEffect, useState } from "react";
import QRScanner from "../components/QRScanner";

const Scan: React.FC = () => {
  const headerTitle = "佔領攻擊點";

  const [isCameraActive, setIsCameraActive] = useState(true);

  useIonViewDidEnter(() => {
    setIsCameraActive(true);
  });

  useIonViewWillLeave(() => {
    setIsCameraActive(false);
  });

  return (
    <IonPage>
      <IonContent
        fullscreen
        scrollX={false}
        scrollY={false}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <QRScanner pause={!isCameraActive} />
      </IonContent>
    </IonPage>
  );
};

export default Scan;
