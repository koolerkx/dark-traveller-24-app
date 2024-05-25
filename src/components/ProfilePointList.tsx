import {
  IonChip,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
} from "@ionic/react";
import { Point } from "./HomeCaptureCard";
import "./ProfilePointList.css";

const LevelChip: React.FC<{ level?: number }> = ({ level }) => {
  switch (level) {
    case 1:
      return <IonChip color="medium">等級 {level}</IonChip>;
    case 2:
      return <IonChip color="success">等級 {level}</IonChip>;
    case 3:
      return <IonChip color="primary">等級 {level}</IonChip>;
    case 4:
      return <IonChip color="tertiary">等級 {level}</IonChip>;
    case 5:
      return <IonChip color="danger">等級 {level}</IonChip>;
    default:
      return <IonChip color="medium">等級 {level}</IonChip>;
  }
};

interface ContainerProps {
  capturedPoints: Point[];
  expiredPoints: Point[];
}

const ProfilePointList: React.FC<ContainerProps> = ({
  capturedPoints,
  expiredPoints,
}) => {
  return (
    <IonList inset={true} lines="full" className="profile-point-list">
      <IonListHeader>
        <IonLabel>攻擊點</IonLabel>
      </IonListHeader>
      <IonItemDivider>
        <IonLabel>佔領中</IonLabel>
        <IonNote className="text-ellipsis">正在為你提供攻擊力</IonNote>
      </IonItemDivider>

      {capturedPoints.map((point) => (
        <IonItem key={point.label}>
          <IonLabel>{point.label}</IonLabel>
          {/* <IonLabel className="level">等級 1</IonLabel> */}

          <LevelChip level={point.level} />
        </IonItem>
      ))}

      <IonItemDivider>
        <IonLabel>已失效</IonLabel>
        <IonNote className="text-ellipsis">你可以重新佔領這些點</IonNote>
      </IonItemDivider>

      {expiredPoints.map((point) => (
        <IonItem key={point.label}>
          <IonLabel>{point.label}</IonLabel>
          <LevelChip level={point.level} />
        </IonItem>
      ))}
    </IonList>
  );
};

export default ProfilePointList;
