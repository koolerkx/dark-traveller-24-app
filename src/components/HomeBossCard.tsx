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
  IonProgressBar,
  IonText,
} from "@ionic/react";
import "./HomeBossCard.css";
import { BossInfo } from "../utils/boss";
import { useMemo } from "react";
import { PlaceholderText } from "./PlaceholderText";

interface ContainerProps {
  boss?: BossInfo | null;
}

const HomeBossCard: React.FC<ContainerProps> = ({ boss }) => {
  const progress = useMemo(
    () => (boss ? boss.hp.remain / boss.hp.total : 1),
    [boss]
  );
  const hpText = useMemo(
    () =>
      !!boss
        ? `HP: ${
            boss.hp.remain > 0 ? Math.round(boss.hp.remain * 100) / 100 : 0
          } / ${boss.hp.total}`
        : null,
    [boss]
  );

  return (
    <IonCard className="boss-card">
      <div className="boss-card-title">
        <IonCardHeader>
          <IonCardTitle>敵人血量</IonCardTitle>
          <IonCardSubtitle>Boss HP</IonCardSubtitle>
        </IonCardHeader>
        <IonCardHeader>
          <IonChip color="dark">
            <PlaceholderText width={100} height={20}>
              {hpText}
            </PlaceholderText>
          </IonChip>
        </IonCardHeader>
      </div>

      <IonCardContent>
        <IonProgressBar value={progress} buffer={1}></IonProgressBar>

        {boss?.hp.remain ?? 0 < 0 ? (
          <div className="boss-card-success-container">
            <IonText>恭喜你成功擊敗Boss！</IonText>
            <IonList
              inset={true}
              lines="full"
              className="boss-card-extra-damage"
            >
              <IonItem className="capture-card-info-dps">
                <IonLabel color={"success"}>溢出傷害</IonLabel>
                <IonLabel className="capture-card-info-dps-text">
                  <PlaceholderText width={60} height={22}>
                    {boss ? (
                      <IonText color={"success"}>
                        {Math.round(Math.abs(boss.hp.remain) * 100) / 100}
                      </IonText>
                    ) : null}
                  </PlaceholderText>
                </IonLabel>
              </IonItem>
            </IonList>
          </div>
        ) : null}
      </IonCardContent>
    </IonCard>
  );
};

export default HomeBossCard;
