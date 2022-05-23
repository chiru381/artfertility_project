import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DayJsUtils from '@date-io/dayjs';
const { withOneTabEnforcer } = require('react-one-tab-enforcer');

import LanguageProvider from './i18n';
import './assets/styles/style.css';

import { store, persistor } from 'redux/store';
import MainRoute from "route/MainRoute";
import RootProvider from 'utils/context/RootProvider';
import { getMuiTheme } from "assets/styles/mui";
import networkInterceptor from 'utils/global/networkInterceptor';
import { DefaultOnlyOneTabComponent } from 'components';

networkInterceptor.setupInterceptors(store);

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <LanguageProvider>
              <MuiPickersUtilsProvider utils={DayJsUtils}>
                <RootProvider>
                  <MuiThemeProvider theme={getMuiTheme}>
                    <MainRoute />
                  </MuiThemeProvider>
                </RootProvider>
              </MuiPickersUtilsProvider>
            </LanguageProvider>
          </Router>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default withOneTabEnforcer({
  appName: "art-fertility-emr",
  OnlyOneTabComponent: DefaultOnlyOneTabComponent
})(App)