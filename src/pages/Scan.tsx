import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
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
  const [isLoading, setIsLoading] = useState(false);
  const [presentLoading, dismissLoading] = useIonLoading();

  useIonViewDidEnter(() => {
    setIsCameraActive(true);
  });

  useIonViewWillLeave(() => {
    setIsCameraActive(false);
  });

  const onScan = useCallback((result: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setIsCameraActive(false);
    presentLoading({
      message: "請稍候片刻...",
    });

    const paramName = "pt";

    const urlObj = new URL(result);
    const params = new URLSearchParams(urlObj.search);
    const param = params.get(paramName);

    // TODO Call Capture Point params

    setIsCameraActive(true);
    dismissLoading();
    setIsLoading(false);
  }, []);

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
        <QRScanner pause={!isCameraActive} onScan={onScan} />
      </IonContent>
    </IonPage>
  );
};

export default Scan;
