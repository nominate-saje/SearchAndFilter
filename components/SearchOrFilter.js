import React, { Component } from "react";
import { createAppContainer, createBottomTabNavigator, createStackNavigator} from "react-navigation";
import { StyleSheet, View, ActivityIndicator, Dimensions } from 'react-native';
import { SearchBar, Text, Header, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import Filter from './Filter.js';
import SearchResults from './SearchResults.js'

class SearchOrFilter extends Component {
  constructor(props){
    super(props);
    this.state = {
      showHome: true,
      search: '',
      showFilter: false,
      isLoading: false,
      data: [],
      showFilterButton: true
    };
  }

  handleSearchChange = search => {
    this.setState({ search })
  };

  handleSearchCancel = () => {
    this.setState({ showResults: false, showFilterButton: true });
  }

  isLoading = () => {
    return (
      <View style={[ styles.centerLoad ]}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    )
  }

  navigateToFilter = () => {
    this.props.navigation.navigate('Filter');
  }

  handleSubmit = () => {
    let search = this.state.search
    this.props.navigation.navigate('SearchResults', {search});
  }

  render () {
    return (
      <View>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'NOMinate', style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
          containerStyle={{
            backgroundColor: '#ffaa00',
          }}
        />
        <View style={styles.container}>
          <View style={styles.top}>
            <Text h4>You know where to go:</Text>
            <SearchBar
              platform="ios"
              clearIcon
              icon={{name: 'home'}}
              containerStyle={{backgroundColor: 'white'}}
              placeholder="Search for a restaurant..."
              onChangeText={this.handleSearchChange}
              onClear={this.handleSearchCancel}
              value={this.state.search}
              onSubmitEditing={this.handleSubmit}
            />
          </View>
          <View style={styles.bot}>
            <Text h4 style={{color: '#fff', marginBottom: 10}}>Let us help you find one</Text>
            <Button 
              raised 
              title="Help me!"
              titleStyle={{color: '#ffaa00'}}
              buttonStyle={{
                backgroundColor: '#fff',
                width: Dimensions.get('window').width - 20,
              }}
              onPress={this.navigateToFilter}
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  center: {
    alignSelf: 'center'
  },
  centerLoad: {
    justifyContent: 'center',
    padding: 20
  },
  top: {
    backgroundColor: '#fff',
    height: Dimensions.get('window').height / 2 - 75,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bot: {
    backgroundColor: '#ffaa00',
    height: Dimensions.get('window').height / 2 - 75,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff'
  }
});

export default createAppContainer(
  createBottomTabNavigator(
    {
      Back: { screen: SearchOrFilter },
      Filter: { screen: Filter },
      SearchResults: { screen: SearchResults}
    }
  )
);

createStackNavigator({
  'Filter' : { screen: Filter },
  'SearchResults' : { screen: SearchResults }
})