import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
  useIonToast,
} from "@ionic/react";
import { close, warning } from "ionicons/icons";
import { useCallback, useRef, useState } from "react";
import { Redirect } from "react-router";
import { useAuth } from "../contexts/auth";
import "./Login.css";
import Splash from "./Splash";

const Login: React.FC = () => {
  const headerTitle = "登入";

  const router = useIonRouter();
  const { isAuthed, isLoading: isAuthLoading, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [present] = useIonToast();

  const usernameRef = useRef<string>("");
  const passwordRef = useRef<string>("");

  const onLoginButtonClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();

      if (isLoading) return;

      try {
        setIsLoading(true);
        if (!usernameRef.current || !passwordRef.current) {
          throw Error("Missing login info");
        }

        await login({
          username: usernameRef.current,
          password: passwordRef.current,
        });

        router.push("/home", "root", "replace");
      } catch {
        present({
          icon: warning,
          message: "登入資訊錯誤",
          duration: 5000,
          position: "bottom",
          swipeGesture: "vertical",
          buttons: [
            {
              icon: close,
              role: "cancel",
            },
          ],
          color: "warning",
        });
      }
      setIsLoading(false);
    },
    [present, login, router]
  );

  return isAuthLoading ? (
    <Splash />
  ) : isAuthed ? (
    <Redirect to={"/home"} />
  ) : (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar>
          <IonTitle>{headerTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{headerTitle}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList inset={false} lines="full">
          <IonItem>
            <IonInput
              label="隊伍"
              labelPlacement="fixed"
              placeholder="隊伍名稱"
              onIonChange={(e) =>
                (usernameRef.current = e.target.value?.toString() ?? "")
              }
              value={usernameRef.current}
            />
          </IonItem>
          <IonItem>
            <IonInput
              type="password"
              label="密碼"
              labelPlacement="fixed"
              placeholder="密碼"
              onIonChange={(e) =>
                (passwordRef.current = e.target.value?.toString() ?? "")
              }
              value={passwordRef.current}
            >
              <IonInputPasswordToggle color={"dark"} />
            </IonInput>
          </IonItem>
        </IonList>
        <div className="ion-padding">
          <IonNote>你可以從工作人員獲取登入資料</IonNote>
        </div>
        <div className="ion-padding">
          <IonButton
            expand="block"
            onClick={onLoginButtonClick}
            disabled={isLoading}
          >
            登入
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
