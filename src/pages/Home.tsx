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
import { useEffect, useMemo, useState } from "react";
import HomeBossCard from "../components/HomeBossCard";
import HomeCaptureCard from "../components/HomeCaptureCard";
import { useAuth } from "../contexts/auth";
import { useRepository } from "../contexts/repository";
import { User } from "../repository/user";
import { getBossInfo } from "../utils/boss";
import "./Home.css";
import { logEvent } from "firebase/analytics";
import { useFirebase } from "../contexts/firebase";
import HomeLevelCard from "../components/HomeLevelCard";

const Home: React.FC = () => {
  const headerTitle = "單車定向";

  const { routeInfo } = useIonRouter();
  const [presentToast, dismissToast] = useIonToast();
  const [isShowLoginToast, setIsShowLoginToast] = useState<boolean>(false);

  const { user: AuthedUser } = useAuth();
  const { userRepository } = useRepository();
  const [user, setUser] = useState<User | null>(null);

  const captuedPoints = useMemo(
    () => user?.capturedPoints.filter((it) => !it.expiredAt),
    [user]
  );
  const bossInfo = useMemo(
    () => (!!user?.capturedPoints ? getBossInfo(user.capturedPoints) : null),
    [captuedPoints]
  );

  const { analytics } = useFirebase();

  useIonViewDidEnter(() => {
    if (!AuthedUser?.email) return;
    if (!userRepository) return;

    setUser(null);

    if (analytics)
      logEvent(analytics, "view", {
        page: "home",
      });

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
      <IonContent fullscreen scrollY={true} scrollX={false}>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{headerTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <HomeBossCard boss={bossInfo} />
        <HomeCaptureCard capturedPoints={captuedPoints} />
        <HomeLevelCard user={user} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
