import React, { Component } from 'react';
import { Grid, Container, Header } from 'semantic-ui-react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { userPlaceIncome } from '../../redux/_actions/ethereum.action';

import Tree from './innerTreeComponent';

import { Link } from 'react-router-dom';
import { HOME_ROUTE } from '../../_constants';

export class LevelFive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      level1: [],
      userId: '',
    };
  }

  componentDidMount = async () => {
    const authResult = new URLSearchParams(window.location.search);
    const address = authResult.get('address');
    const id = authResult.get('id');
    const { userPlaceIncome } = this.props;
    let response = await userPlaceIncome(address, 1);
    this.setState({ level1: [response], userId: id });
  };

  render() {
    const { level1 } = this.state;

    return (
      <div className="contentArea">
        <div className="teamMainOut">
          <div className="teamMain">
            <div className="teamRight">
              <Container fluid>
                <div className="teamRight_block">
                  <Grid columns={6}>
                    <Grid.Row className="fastPlanRow fastPlanRow2">
                      <Header as="h3">TRX 10 </Header>
                      <h3>
                        {' '}
                        <Link to={`${HOME_ROUTE}auth/home`}>Back</Link>
                      </h3>
                      <div className="premiumBox">
                        <h4>
                          <span style={{ color: 'white' }}>
                            {this.state.userId}
                          </span>
                        </h4>

                        <div className="toplist">
                          <div className="toplistIn ">
                            <ul className="topbox">
                              <Tree
                                click={false}
                                slot={1}
                                data={level1 ? level1[0] : []}
                                klass={'levelOne'}
                              />
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Grid.Row>
                  </Grid>
                </div>
              </Container>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    userPlaceIncome: (address, level) =>
      dispatch(userPlaceIncome(address, level)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(LevelFive)
);
