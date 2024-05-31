import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonList,
  IonPopover,
  IonText,
  useIonRouter,
} from "@ionic/react";
import "./ProfileInfoCard.css";
import { ellipsisHorizontal, ellipsisVertical } from "ionicons/icons";
import { useAuth } from "../contexts/auth";
import { useCallback } from "react";

export const ProfileInfoCardHeaderButton: React.FC<{ className: string }> = ({
  className,
}) => {
  const { logout } = useAuth();
  const { push } = useIonRouter();

  const onLogoutButtonClick = useCallback(async () => {
    await logout();
    push("/login", "none", "replace");
  }, [logout, push]);

  return (
    <div className={className}>
      <IonButton
        shape="round"
        size="small"
        color={"dark"}
        id="profile-card-popover-button"
      >
        <IonIcon
          slot="icon-only"
          ios={ellipsisHorizontal}
          md={ellipsisVertical}
        />
      </IonButton>
      <IonPopover
        trigger="profile-card-popover-button"
        dismissOnSelect={true}
        alignment="center"
        side="bottom"
        showBackdrop={false}
      >
        <IonContent>
          <IonList>
            <IonItem button={true} detail={false} onClick={onLogoutButtonClick}>
              登出
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>
    </div>
  );
};

interface ContainerProps {}

const ProfileInfoCard: React.FC<ContainerProps> = () => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>SY1</IonCardTitle>
        <IonCardSubtitle>隊伍名稱</IonCardSubtitle>
      </IonCardHeader>

      <ProfileInfoCardHeaderButton className="profile-card-button" />

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
