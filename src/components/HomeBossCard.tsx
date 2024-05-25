import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonProgressBar,
} from "@ionic/react";
import "./HomeBossCard.css";

interface ContainerProps {}

const HomeBossCard: React.FC<ContainerProps> = () => {
  return (
    <IonCard className="boss-card">
      <div className="boss-card-title">
        <IonCardHeader>
          <IonCardTitle>敵人血量</IonCardTitle>
          <IonCardSubtitle>Boss HP</IonCardSubtitle>
        </IonCardHeader>
        <IonCardHeader>
          <IonChip color="dark">HP: 2481 / 3222</IonChip>
        </IonCardHeader>
      </div>

      <IonCardContent>
        <IonProgressBar value={0.75} buffer={1}></IonProgressBar>
      </IonCardContent>
    </IonCard>
  );
};

export default HomeBossCard;
