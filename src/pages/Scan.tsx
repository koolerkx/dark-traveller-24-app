import {
  IonContent,
  IonPage,
  useIonAlert,
  useIonLoading,
  useIonViewDidEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import { useCallback, useState } from "react";
import QRScanner from "../components/QRScanner";
import { useAuth } from "../contexts/auth";
import { useRepository } from "../contexts/repository";
import { CapturedPointInCooldownError } from "../error";
import { CAPTURED_POINT_COOLDOWN_SECONDS } from "../repository/user";
import "./Home.css";

const Scan: React.FC = () => {
  const headerTitle = "佔領攻擊點";

  const [isCameraActive, setIsCameraActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [presentLoading, dismissLoading] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const { userRepository } = useRepository();
  const { user: authedUser } = useAuth();

  useIonViewDidEnter(() => {
    setIsCameraActive(true);
  });

  useIonViewWillLeave(() => {
    setIsCameraActive(false);
  });

  const onScan = useCallback(async (result: string) => {
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

    let resetOnDismiss = false;
    try {
      if (userRepository && param && authedUser?.email) {
        const user = await userRepository.getUser(authedUser.email);

        await userRepository.capturePoint(user, param);
      }
    } catch (error) {
      resetOnDismiss = true;
      if (error instanceof CapturedPointInCooldownError) {
        presentAlert({
          header: "攻擊點處於保護狀態",
          subHeader: `剩餘時間：${error.secondsSincecaptured} / ${CAPTURED_POINT_COOLDOWN_SECONDS}秒`,
          message: `攻擊點被佔領後5分鐘內，無法被佔領、升級及清除。你可以先到其他攻擊點進行佔領！`,
          buttons: ["關閉訊息"],
          onDidDismiss: () => {
            setIsCameraActive(true);
            setIsLoading(false);
          },
        });
      } else {
        presentAlert({
          header: "出現錯誤",
          message: `請稍後再試，數次都不成功請聯絡管理員。`,
          buttons: ["關閉訊息"],
          onDidDismiss: () => {
            setIsCameraActive(true);
            setIsLoading(false);
          },
        });
      }

      console.error(error);
    } finally {
      dismissLoading();
      if (resetOnDismiss) return;
      setIsCameraActive(true);
      setIsLoading(false);
    }
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
