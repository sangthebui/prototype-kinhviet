import React from 'react';
import {
    Segment,
    Container,
    Grid,
    Header,
} from 'semantic-ui-react';

const Footer = () => {
    return (
        <Segment inverted vertical style={{ padding: '5em 0em' }} color='yellow'>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column >
              <Header as='h4' inverted>
               Kinh Ngữ @ copyright 2022
              </Header>
              <p>
                Sẽ có thêm chi tiết sao đây. Cam ơn.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </Segment>
    )
}

export default Footer;