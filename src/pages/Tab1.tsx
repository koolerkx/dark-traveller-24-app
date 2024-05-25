import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab1.css";

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>單車定向</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">單車定向</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonCard>
          <div className="card-title">
            <IonCardHeader>
              <IonCardTitle>敵人</IonCardTitle>
              <IonCardSubtitle>Boss</IonCardSubtitle>
            </IonCardHeader>
            <IonCardHeader>
              <IonChip color="dark">HP: 2481 / 3222</IonChip>
            </IonCardHeader>
          </div>

          <IonCardContent>
            <IonProgressBar value={0.75} buffer={1}></IonProgressBar>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
