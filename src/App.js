import React from 'react';
import MessengerComposer from 'components/MessengerComposer';
import 'styles/app.css';

class App extends React.Component {
  state = {
    user: 'Taylor',
    location: 'Paul Blanco',
    organization: 'Toyota',
    contact: 'Billy'
  }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value });

  render() {
    const {
      user,
      location,
      organization,
      contact
    } = this.state;
    return (
      <div>
        <input
          name='user'
          value={user}
          name='user'
          onChange={this.handleChange}
        />
        <input
          name='location'
          value={location}
          name='location'
          onChange={this.handleChange}
        />
        <input
          name='organization'
          value={organization}
          name='organization'
          onChange={this.handleChange}
        />
        <input
          name='contact'
          value={contact}
          name='contact'
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
