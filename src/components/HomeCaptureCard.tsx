import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSpinner,
} from "@ionic/react";
import { CapturedPoint } from "../repository/point";
import { getAttackPower } from "../utils/attackPower";
import "./HomeCaptureCard.css";
import { levelColor } from "./LevelChip";
import { PlaceholderText } from "./PlaceholderText";

export const PointChip: React.FC<{
  label: string;
  level: number;
}> = ({ label, level }) => (
  <IonChip
    color={levelColor[level.toString()]}
    style={{
      pointerEvents: "none",
    }}
  >
    <div className="text-ellipsis">{label}</div>
  </IonChip>
);

interface ContainerProps {
  capturedPoints: CapturedPoint[] | null | undefined;
}

const HomeCaptureCard: React.FC<ContainerProps> = ({ capturedPoints }) => {
  return (
    <IonCard className="capture-card">
      <IonCardHeader>
        <IonCardTitle>佔領中</IonCardTitle>
        <IonCardSubtitle>CAPTURE</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList inset={true} lines="full" className="capture-card-info-list">
          <IonItem className="capture-card-info-dps">
            <IonLabel>每分鐘攻擊力</IonLabel>
            <IonLabel className="capture-card-info-dps-text">
              <PlaceholderText width={60} height={22}>
                {capturedPoints
                  ? Math.round(getAttackPower(capturedPoints) * 60)
                  : null}
              </PlaceholderText>
            </IonLabel>
          </IonItem>
        </IonList>

        {!!capturedPoints ? (
          capturedPoints.length > 0 ? (
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
            <div className="capture-card-point-none-hint">
              <p>沒有正在佔領的攻擊點</p>
              <p>提示：你可以到地圖查看攻擊點的位置。</p>
            </div>
          )
        ) : (
          <div className="capture-card-point-loading">
            <IonSpinner name="dots" />
          </div>
        )}

        <div className="capture-card-note">
          <p>到地圖尋找攻擊點位置吧！</p>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default HomeCaptureCard;
