import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonText,
} from "@ionic/react";
import "./ProfileInfoCard.css";

interface ContainerProps {}

const ProfileInfoCard: React.FC<ContainerProps> = () => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>SY1</IonCardTitle>
        <IonCardSubtitle>隊伍名稱</IonCardSubtitle>
      </IonCardHeader>

      <IonCardContent>
        <div className="profile-data-list">
          <IonText color="medium" className="profile-data-item">
            <h3 className="profile-data-title">攻擊力</h3>
            <div className="profile-data-datum">120</div>
            <h3 className="profile-data-unit">/秒</h3>
          </IonText>

          <span className="profile-data-list-separator"></span>

          <IonText color="medium" className="profile-data-item">
            <h3 className="profile-data-title">排名</h3>
            <div className="profile-data-datum">4</div>
            <h3 className="profile-data-unit">位</h3>
          </IonText>

          <span className="profile-data-list-separator"></span>

          <IonText color="medium" className="profile-data-item">
            <h3 className="profile-data-title">現時佔領</h3>
            <div className="profile-data-datum">4</div>
            <h3 className="profile-data-unit">個點</h3>
          </IonText>

          <span className="profile-data-list-separator"></span>

          <IonText color="medium" className="profile-data-item">
            <h3 className="profile-data-title">升級了</h3>
            <div className="profile-data-datum">2</div>
            <h3 className="profile-data-unit">次</h3>
          </IonText>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ProfileInfoCard;
