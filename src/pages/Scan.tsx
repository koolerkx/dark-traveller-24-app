import {
  IonContent,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import "./Home.css";
import RankingTable from "../components/RankingTable";
import { useCallback } from "react";

const Scan: React.FC = () => {
  const headerTitle = "排行榜";

  const handleRefresh = useCallback(
    (event: CustomEvent<RefresherEventDetail>) => {
      setTimeout(() => {
        event.detail.complete();
      }, 2000);
    },
    []
  );

  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{headerTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{headerTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <RankingTable />
      </IonContent>
    </IonPage>
  );
};

export default Scan;
