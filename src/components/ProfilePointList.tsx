import {
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
} from "@ionic/react";
import { CapturedPoint } from "../repository/point";
import { LevelChip } from "./LevelChip";
import "./ProfilePointList.css";

interface ContainerProps {
  capturedPoints: CapturedPoint[];
  expiredPoints: CapturedPoint[];
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

      {capturedPoints.length > 0 ? (
        <>
          {capturedPoints.map((point) => (
            <IonItem key={point.pointId}>
              <IonLabel>{point.pointName}</IonLabel>
              {/* <IonLabel className="level">等級 1</IonLabel> */}

              <LevelChip level={point.level} />
            </IonItem>
          ))}
        </>
      ) : (
        <>
          <IonItem>
            <IonNote className="text-ellipsis">
              沒有正在佔領的攻擊點，你可以到地圖查看攻擊點的位置。
            </IonNote>
          </IonItem>
        </>
      )}

      {expiredPoints.length > 0 ? (
        <>
          <IonItemDivider>
            <IonLabel>已失效</IonLabel>
            <IonNote className="text-ellipsis">你可以重新佔領這些點</IonNote>
          </IonItemDivider>

          {expiredPoints.map((point) => (
            <IonItem key={point.pointId}>
              <IonLabel>{point.pointName}</IonLabel>
              <LevelChip level={point.level} />
            </IonItem>
          ))}
        </>
      ) : null}
    </IonList>
  );
};

export default ProfilePointList;
