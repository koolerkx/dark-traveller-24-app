import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonViewDidEnter,
} from "@ionic/react";
import { Point } from "../components/HomeCaptureCard";
import ProfileInfoCard from "../components/ProfileInfoCard";
import "../components/ProfileInfoCard.css";
import ProfilePointList from "../components/ProfilePointList";
import "./Home.css";
import { useAuth } from "../contexts/auth";
import { useRepository } from "../contexts/repository";
import { useEffect, useState } from "react";
import { User } from "../repository/user";
import { checkmarkCircle, close } from "ionicons/icons";

const Profile: React.FC = () => {
  const headerTitle = "隊伍狀態";

  const capturedPoints: Point[] = [
    { label: "天瑞體育館", level: 5 },
    { label: "天水圍運動場", level: 4 },
  ];

  const expiredPoints: Point[] = [
    { label: "天瑞體育館", level: 3 },
    { label: "天水圍運動場", level: 2 },
    { label: "濕地公園門口", level: 1 },
  ];

  const _user = useAuth().user;
  const [present] = useIonToast();

  const { userRepository } = useRepository();

  const [user, setUser] = useState<User | null>(null);

  const loadUser = () => {
    if (!_user?.email) return;
    if (!userRepository) return;

    userRepository
      ?.getUser(_user.email)
      .then(setUser)
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
  };

  useIonViewDidEnter(() => {
    loadUser();
  });

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
        <ProfileInfoCard user={user} />
        <ProfilePointList
          capturedPoints={capturedPoints}
          expiredPoints={expiredPoints}
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
