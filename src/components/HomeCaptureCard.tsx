import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import "./HomeCaptureCard.css";

export type Point = string;

export const PointChip: React.FC<{
  label: string;
}> = ({ label }) => (
  <IonChip color="primary">
    <div className="text-ellipsis">{label}</div>
  </IonChip>
);

interface ContainerProps {}

const HomeCaptureCard: React.FC<ContainerProps> = () => {
  const points: Point[] = [
    "天瑞體育館",
    "天水圍運動場",
    "濕地公園門口",
    "天水圍單車匯合中心",
  ];

  return (
    <IonCard className="capture-card">
      <IonCardHeader>
        <IonCardTitle>佔領中</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList inset={true} lines="full">
          <IonItem className="capture-card-info-dps">
            <IonLabel>每秒攻擊力 DPS</IonLabel>
            <IonLabel>120</IonLabel>
          </IonItem>
        </IonList>

        <div className="capture-card-point-list">
          {points.map((point) => (
            <PointChip key={point} label={point} />
          ))}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default HomeCaptureCard;
