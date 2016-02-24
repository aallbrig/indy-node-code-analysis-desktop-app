import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Folder.css';
import {Grid, Col, Row, Input,Glyphicon, ListGroup, ListGroupItem} from 'react-bootstrap';
const remote = require('remote');
const electron = remote.require('electron');
const dialog = electron.dialog;
const globby = remote.require('globby');

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: '',
      loading: false,
      filePaths: []
    };
  }

  onSearchFolderClick() {
    const path = dialog.showOpenDialog({ properties: [ 'openDirectory']});
    window.console.log('onSearchFolderClick');
    window.console.log(path);
    if (path) {
      const firstSelection = path[0];
      this.setState({
        path: firstSelection,
        loading: true,
        filePaths: []
      });
      window.console.log(globby([`${firstSelection}/**/.git`, `!${firstSelection}/**/node_modules/**/.git`]));
      const operation = globby([`${firstSelection}/**/.git`, `!${firstSelection}/**/node_modules/**/.git`])
      operation.then((filePaths) => {
        window.console.log('globby done!');
        window.console.log(filePaths);
        this.setState({
          filePaths: filePaths,
          loading: false
        });
      });
    }
  }

  render() {
    const {path} = this.state;
    window.console.log('this.state');
    window.console.log(this.state);
    const folderSelectButton = (
      <Glyphicon glyph="folder-open" onClick={this.onSearchFolderClick.bind(this)}/>
    );
    return (
      <Grid>
        <Row>
          <div className={styles.backButton}>
            <Link to="/">
              <i className="fa fa-arrow-left fa-1x" />
              <span> Back</span>
            </Link>
          </div>
        </Row>
        <Row>
          <Col xs={3}>
            { /* sidebar */ }
            <h3>Analysis</h3>
            <p>There are {this.state.filePaths.length} git repositories</p>
            {this.state.loading ?
            <Glyphicon glyph="refresh" className={styles.glyphiconRefreshAnimate} />
            : null
            }
          </Col>
          <Col xs={9}>
            <Input
            type="text"
            value={path || 'Please select folder'}
            readOnly
            placeholder="File Path"
            label="File Path"
            addonAfter={folderSelectButton}
            ref="input"
            groupClassName="group-class"
            labelClassName="label-class"/>
            {this.state.loading ?
            <Glyphicon glyph="refresh" className={styles.glyphiconRefreshAnimate} />
            : null
            }
            <Col xs={12} className={styles.gitListGroup}>
              <ListGroup>
                {this.state.filePaths.map((filePath) => {
                  return (<ListGroupItem>{filePath}</ListGroupItem>)
                })}
              </ListGroup>
            </Col>
          </Col>
        </Row>
      </Grid>
    );
  }
}
