import {
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import { PointChip } from "./HomeCaptureCard";
import "./RankingTable.css";
import { User, UserForRanking } from "../repository/user";
import { useFirebase } from "../contexts/firebase";
import { logEvent } from "firebase/analytics";

const RankingItem: React.FC<{
  rank: number;
  user: UserForRanking;
  onClick: (rank: number, user: UserForRanking) => void;
}> = ({ user, rank, onClick }) => {
  return (
    <IonAccordion value={rank.toString()}>
      <IonItem slot="header" onClick={() => onClick(rank, user)}>
        <IonLabel>
          {rank}. {user.name}
        </IonLabel>
      </IonItem>

      {user.activePoints.length > 0 ? (
        <div className="ion-padding ranking-point-list" slot="content">
          {user.activePoints.map((point, idx) => (
            <PointChip
              key={`${idx}|${point.pointId}|${point.userId}`}
              label={point.pointName}
              level={point.level}
            />
          ))}
        </div>
      ) : (
        <div className="ranking-point-none" slot="content">
          <p>沒有正在佔領的攻擊點</p>
        </div>
      )}
    </IonAccordion>
  );
};

interface ContainerProps {
  users: UserForRanking[];
}

const RankingTable: React.FC<ContainerProps> = ({ users }) => {
  const { analytics } = useFirebase();

  const onClick = (rank: number, user: UserForRanking) => {
    if (analytics)
      logEvent(analytics, "rank_click", {
        name: user.name,
        rank: rank,
      });
  };

  return (
    <IonList inset={true}>
      <IonAccordionGroup>
        {users.map((user, idx) => (
          <RankingItem
            key={user.id}
            rank={idx + 1}
            user={user}
            onClick={onClick}
          />
        ))}
      </IonAccordionGroup>
    </IonList>
  );
};

export default RankingTable;
