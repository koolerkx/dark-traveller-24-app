import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
} from "@ionic/react";
import { CapturedPoint } from "../repository/point";
import { getAttackPower } from "../utils/attackPower";
import "./HomeCaptureCard.css";
import { levelColor } from "./LevelChip";
import { PlaceholderText } from "./PlaceholderText";

export type Point = { label: string; level?: number };

export const PointChip: React.FC<{
  label: string;
  level: number;
}> = ({ label, level }) => (
  <IonChip color={levelColor[level.toString()]}>
    <div className="text-ellipsis">{label}</div>
  </IonChip>
);

interface ContainerProps {
  capturedPoints: CapturedPoint[] | null;
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
            <IonLabel className="capture-card-info-dps-text">
              <PlaceholderText width={60} height={22}>
                {capturedPoints ? getAttackPower(capturedPoints) : null}
              </PlaceholderText>
            </IonLabel>
          </IonItem>
        </IonList>

        {!!capturedPoints ? (
          <div className="capture-card-point-list">
            {capturedPoints.map((point) => (
              <PointChip
                key={point.pointId}
                label={point.pointName}
                level={point.level}
              />
            ))}
          </div>
        ) : (
          <div className="capture-card-point-loading">
            <IonSpinner name="dots" />
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default HomeCaptureCard;
