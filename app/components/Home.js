import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.css';


export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <h3>Code Analysis Desktop App</h3>
          <Link to="/folder">To the App!</Link>
        </div>
      </div>
    );
  }
}
