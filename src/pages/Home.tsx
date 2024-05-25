import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import HomeBossCard from "../components/HomeBossCard";
import "./Home.css";

const Home: React.FC = () => {
  const headerTitle = "單車定向";

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
      </IonContent>
    </IonPage>
  );
};

export default Home;
