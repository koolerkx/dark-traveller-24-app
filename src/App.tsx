import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Home from "./pages/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

// import '@ionic/react/css/palettes/dark.always.css';
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import { home, map, person, podium } from "ionicons/icons";
import "./theme/variables.css";

import { useAuth } from "./contexts/auth";
import Login from "./pages/Login";
import Map from "./pages/Map";
import Profile from "./pages/Profile";
import Ranking from "./pages/Ranking";
import { AuthRoute } from "./route";
import "./theme/global.css";
import { useEffect } from "react";

setupIonicReact();

const App: React.FC = () => {
  const { isAuthed, isLoading } = useAuth();

  const tabBarButtonConfig = [
    {
      name: "home",
      icon: home,
      label: "主頁",
    },
    {
      name: "map",
      icon: map,
      label: "地圖",
    },
    {
      name: "ranking",
      icon: podium,
      label: "排行榜",
    },
    {
      name: "profile",
      icon: person,
      label: "狀態",
    },
  ];

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            {/* Public Route */}
            <Route exact path="/">
              <Redirect to={"/login"} />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            {/* Auth Route */}
            <Route
              exact
              path="/home"
              render={() => (isAuthed ? <Home /> : <Login />)}
            ></Route>
            <Route
              exact
              path="/map"
              render={() => (isAuthed ? <Map /> : <Login />)}
            ></Route>
            <Route
              exact
              path="/ranking"
              render={() => (isAuthed ? <Ranking /> : <Login />)}
            ></Route>
            <Route
              exact
              path="/profile"
              render={() => (isAuthed ? <Profile /> : <Login />)}
            ></Route>
          </IonRouterOutlet>
          <IonTabBar
            slot="bottom"
            className={!isLoading && isAuthed ? "" : "display-none"}
          >
            {tabBarButtonConfig.map((config, index) => (
              <IonTabButton
                key={index}
                tab={config.name}
                href={"/" + config.name}
              >
                <IonIcon aria-hidden="true" icon={config.icon} />
                <IonLabel>{config.label}</IonLabel>
              </IonTabButton>
            ))}
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
