import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonViewDidEnter,
} from "@ionic/react";
import { isAfter } from "date-fns";
import { checkmarkCircle, close } from "ionicons/icons";
import { useMemo, useState } from "react";
import ProfileInfoCard from "../components/ProfileInfoCard";
import "../components/ProfileInfoCard.css";
import ProfilePointList from "../components/ProfilePointList";
import { useAuth } from "../contexts/auth";
import { useRepository } from "../contexts/repository";
import { CapturedPoint } from "../repository/point";
import { User } from "../repository/user";
import "./Home.css";

const Profile: React.FC = () => {
  const headerTitle = "隊伍狀態";

  const _user = useAuth().user;
  const [presentToast] = useIonToast();

  const { userRepository } = useRepository();

  const [user, setUser] = useState<User | null>(null);
  const [rankedUsers, setRankedUser] = useState<User[] | null>(null);

  const userRanking = useMemo(() => {
    if (!user) return null;
    if (!rankedUsers) return null;

    const rankIndex = rankedUsers.findIndex((it) => it.id === user?.id);

    return rankIndex + 1;
  }, [user, userRepository]);
  const capturedPoints = useMemo(
    () =>
      user ? user.capturedPoints.filter((it) => it.expiredAt === null) : null,
    [user?.capturedPoints]
  );
  const expiredPoints = useMemo(
    () =>
      user
        ? Object.values(
            user.capturedPoints.reduce(
              (acc, cur) => ({
                ...acc,
                [cur.pointId]: isAfter(
                  cur.createdAt,
                  acc[cur.pointId]?.createdAt ?? 0
                )
                  ? cur
                  : acc[cur.pointId] || cur,
              }),
              {} as Record<string, CapturedPoint>
            ) ?? {}
          ).filter((it) => !!it.expiredAt)
        : null,
    [user?.capturedPoints]
  );

  const loadUser = () => {
    if (!_user?.email) return;
    if (!userRepository) return;

    setUser(null);
    setRankedUser(null);

    userRepository
      ?.getUser(_user.email)
      .then(setUser)
      .catch((error) => {
        console.error(error);
        presentToast({
          message: "出錯了！無法獲取用戶資料。",
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

    userRepository
      .getRanking()
      .then((it) => {
        setRankedUser(it);
      })
      .catch((error) => {
        console.error(error);
        presentToast({
          message: "出錯了！無法獲取排行資料。",
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
        <ProfileInfoCard user={user} rank={userRanking} />
        <ProfilePointList
          capturedPoints={capturedPoints}
          expiredPoints={expiredPoints}
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
