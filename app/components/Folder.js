import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Folder.css';
import {Grid, Col, Row, Input,Glyphicon, ListGroup, ListGroupItem} from 'react-bootstrap';
const remote = require('remote');
const electron = remote.require('electron');
const dialog = electron.dialog;
const shell = electron.shell;
const globby = remote.require('globby');
const fs = remote.require('fs');
const exec = remote.require('child_process').exec;
let child;

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
    if (path) {
      const firstSelection = path[0];
      this.setState({
        path: firstSelection,
        loading: true,
        filePaths: []
      });
      const operation = globby([`${firstSelection}/**/.git`, `!${firstSelection}/**/node_modules/**/.git`])
      operation.then((filePaths) => {
        var myNotification = new Notification('Look at the App again!', {
          body: 'Folder fetch complete!'
        });
        this.setState({
          filePaths: filePaths,
          loading: false
        });
      });
    }
  }

  onFilePathClick(filePath) {
    child = exec(`cd ${filePath} && git config --get remote.origin.url`, (error, stdout, stderr) => {
      if (stdout) {
        shell.openExternal(`https://github.com/${stdout.replace("git@github.com:", "").replace(".git","").replace("https://github.com/","")}`);
      }
    });
  }

  render() {
    const {path} = this.state;
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
            {this.state.loading ?
            <Glyphicon glyph="refresh" className={styles.glyphiconRefreshAnimate} />
            : <p>There are {this.state.filePaths.length} git repositories</p>
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
                  return (<ListGroupItem onClick={this.onFilePathClick.bind(this, filePath)}>{filePath}</ListGroupItem>)
                })}
              </ListGroup>
            </Col>
          </Col>
        </Row>
      </Grid>
    );
  }
}
