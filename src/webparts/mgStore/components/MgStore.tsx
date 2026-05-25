import * as React from 'react';
import styles from './MgStore.module.scss';
import type { IMgStoreProps } from './IMgStoreProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import {Dashboard} from './Pages/Dashboard';
import {CategoryDashboard} from './Pages/CategoryDashboard';
export default class MgStore extends React.Component<IMgStoreProps> {
  public render(): React.ReactElement<IMgStoreProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.mgStore} ${hasTeamsContext ? styles.teams : ''}`}>
        <div>
          <Router>
          <Switch>
            <Route exact path="/" render={() => <Dashboard {...this.props} />} />
            <Route exact path="/Dashboard" render={() => <Dashboard {...this.props} />} />
            <Route exact path="/CategoryDashboard" render={() => <CategoryDashboard {...this.props} />} />
          </Switch>
        </Router>
        </div>
      </section>
    );
  }
}
