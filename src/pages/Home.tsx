import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { checkmarkCircle, close } from "ionicons/icons";
import { useEffect, useState } from "react";
import HomeBossCard from "../components/HomeBossCard";
import HomeCaptureCard from "../components/HomeCaptureCard";
import "./Home.css";

const Home: React.FC = () => {
  const headerTitle = "單車定向";

  const { routeInfo } = useIonRouter();
  const [present] = useIonToast();
  const [isShowLoginToast, setIsShowLoginToast] = useState<boolean>(false);

  useEffect(() => {
    if (!isShowLoginToast && routeInfo.lastPathname == "/login") {
      present({
        message: "登入成功",
        duration: 5000,
        icon: checkmarkCircle,
        position: "bottom",
        color: "success",
        swipeGesture: "vertical",
        buttons: [
          {
            icon: close,
            role: "cancel",
          },
        ],
      });
      setIsShowLoginToast(true);
    }
  }, [routeInfo, isShowLoginToast]);

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{headerTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{headerTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <HomeBossCard />
        <HomeCaptureCard />
      </IonContent>
    </IonPage>
  );
};

export default Home;
