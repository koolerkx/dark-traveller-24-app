import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Point } from "../components/HomeCaptureCard";
import ProfileInfoCard from "../components/ProfileInfoCard";
import "../components/ProfileInfoCard.css";
import ProfilePointList from "../components/ProfilePointList";
import "./Home.css";

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
        <ProfileInfoCard />
        <ProfilePointList
          capturedPoints={capturedPoints}
          expiredPoints={expiredPoints}
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
