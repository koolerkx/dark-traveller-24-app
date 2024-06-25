import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonToast,
  useIonViewDidEnter,
} from "@ionic/react";
import { checkmarkCircle, close } from "ionicons/icons";
import { useEffect, useState } from "react";
import HomeBossCard from "../components/HomeBossCard";
import HomeCaptureCard from "../components/HomeCaptureCard";
import "./Home.css";
import { User } from "../repository/user";
import { useRepository } from "../contexts/repository";
import { useAuth } from "../contexts/auth";

const Home: React.FC = () => {
  const headerTitle = "單車定向";

  const { routeInfo } = useIonRouter();
  const [presentToast, dismissToast] = useIonToast();
  const [isShowLoginToast, setIsShowLoginToast] = useState<boolean>(false);

  const { user: AuthedUser } = useAuth();
  const { userRepository } = useRepository();
  const [user, setUser] = useState<User | null>(null);

  const captuedPoints =
    user?.capturedPoints.filter((it) => !it.expiredAt) ?? [];

  useIonViewDidEnter(() => {
    if (!AuthedUser?.email) return;
    if (!userRepository) return;

    userRepository
      .getUser(AuthedUser.email)
      .then((user) => {
        setUser(user);
      })
      .catch((error) => {
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
        console.error(error);
      });
  });

  useEffect(() => {
    if (!isShowLoginToast && routeInfo.lastPathname == "/login") {
      dismissToast();
      presentToast({
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
        <HomeCaptureCard capturedPoints={captuedPoints} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
