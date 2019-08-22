import React from 'react';
import MessengerComposer from 'components/MessengerComposer';
import 'styles/app.css';

class App extends React.Component {
  state = {
    channelType: 'phone',
    currentLocation: {
      name: 'Podium in Lehi',
      organizationName: 'Podium',
      podiumNumber: '+13852172459',
    },
    currentUser: {
      firstName: 'John',
      lastName: 'Snow',
    },
    parsedContactName: 'John Snow'
  }

  handleChange = ({ target: { value } }) => this.setState({ parsedContactName: value });

  render() {
    const {
      parsedContactName
    } = this.state;
    return (
      <div>
        <input
          name='contact'
          value={parsedContactName}
          onChange={this.handleChange}
        />
        <MessengerComposer
          {...this.state}
        />
      </div>
    )
  }
}

export default App;
