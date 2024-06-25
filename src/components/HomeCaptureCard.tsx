import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
} from "@ionic/react";
import "./HomeCaptureCard.css";
import { CapturedPoint } from "../repository/point";

export type Point = { label: string; level?: number };

export const PointChip: React.FC<{
  label: string;
}> = ({ label }) => (
  <IonChip color="primary">
    <div className="text-ellipsis">{label}</div>
  </IonChip>
);

interface ContainerProps {
  capturedPoints: CapturedPoint[];
}

const HomeCaptureCard: React.FC<ContainerProps> = ({ capturedPoints }) => {
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
          {capturedPoints.map((point) => (
            <PointChip key={point.pointId} label={point.pointName} />
          ))}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default HomeCaptureCard;
