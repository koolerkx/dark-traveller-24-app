import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSpinner,
} from "@ionic/react";
import { CapturedPoint } from "../repository/point";
import { getAttackPower } from "../utils/attackPower";
import "./HomeLevelCard.css";
import { levelColor } from "./LevelChip";
import { PlaceholderText } from "./PlaceholderText";
import { User } from "../repository/user";
import { starHalfSharp, starOutline, starSharp } from "ionicons/icons";

interface ContainerProps {
  user: User | null;
}

const HomeLevelCard: React.FC<ContainerProps> = ({ user }) => {
  const level = user?.level;
  const maximumLevel = 5;

  return (
    <IonCard className="capture-card">
      <IonCardHeader>
        <IonCardTitle>等級</IonCardTitle>
        <IonCardSubtitle>LEVEL</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList inset={true} lines="full" className="capture-card-info-list">
          <IonItem className="capture-card-info-dps">
            <IonLabel>佔領等級</IonLabel>
            <IonLabel className="capture-card-info-dps-text">
              <PlaceholderText width={60} height={22}>
                {user?.level}
              </PlaceholderText>
            </IonLabel>
          </IonItem>
        </IonList>

        {user ? (
          <div className="level-card-stars-container">
            <>
              {[...Array(user?.level).keys()].map((_elm, idx) => (
                <IonIcon
                  aria-hidden="true"
                  icon={starSharp}
                  key={`star${idx}`}
                  size="large"
                />
              ))}
              {[...Array(maximumLevel - (user?.level ?? 0)).keys()].map(
                (_elm, idx) => (
                  <IonIcon
                    aria-hidden="true"
                    icon={starOutline}
                    key={`star-outline${idx}`}
                    size="large"
                  />
                )
              )}
            </>
          </div>
        ) : (
          <div className="capture-card-point-loading">
            <IonSpinner name="dots" />
          </div>
        )}
        <div className="level-card-note">
          <p>等級是獲勝的關鍵，找出升級點進行升級吧！</p>
          <p>升級後重新佔領攻擊點吧！</p>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default HomeLevelCard;
