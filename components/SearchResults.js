import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView, Alert, Linking } from 'react-native';
import { SearchBar, Text, Header, Button, Card, Image } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { YELP_API_KEY, DB_URL } from '../config.js';

export default class SearchResults extends Component {
  constructor(props){
    super(props);
    this.state = {
      showHome: true,
      search: '',
      showFilter: false,
      showResults: false,
      isLoading: false,
      data: [],
      showFilterButton: true
    };
  }

  componentDidMount() {
    let term = this.props.navigation.getParam('search', 'failed')
    this.fetchResults(term);
  }

  fetchResults = (term) => {
    const location = 'Los Angeles'
    this.setState({ showFilterButton: false, isLoading: true })
    const obj = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'Bearer ' + YELP_API_KEY
      }
    }
    
    return fetch(`https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&limit=5`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          data: responseJson.businesses,
        })
      })
      .catch((error) => console.error(error));
  }  


  handleSubmit = () => {
    const location = 'Los Angeles';
    const term = this.state.search;
    this.setState({ showFilterButton: false, isLoading: true })
    const obj = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'Bearer ' + YELP_API_KEY
      }
    }
    
    return fetch(`https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&limit=5`, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          data: responseJson.businesses,
        })
      })
      .catch((error) => console.error(error));
  }  

  isLoading = () => {
    return (
      <View style={[ styles.centerLoad ]}>
        <ActivityIndicator size="large" color="#ffaa00" />
      </View>
    )
  }

  handleSearchChange = search => {
    this.setState({ search });
  };

  navigateToFilter = () => {
    this.props.navigation.navigate('Filter');
  }

  handleAddEvent = (name, yelpId) => {
    const eventId = 'MYUYf0g9xJbYiXmc92M5'
    return fetch(DB_URL + eventId + '/restaurants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: "f2rTyh",
        name,
        yelpId
      })
    })
    .then((res) => {
      Alert.alert(
        'NOMinated!',
        ':)',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed') /*navigate to event page*/},
        ],
        {cancelable: false},
      );
    })
    .catch((err) => {
      Alert.alert(
        'Sorry..try again',
        ':(',
        [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {cancelable: false},
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'NOMinate', style: { color: '#fff' } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
          containerStyle={{
            backgroundColor: '#ffaa00',
          }}
        />
        <View>
          <Text h4 style={styles.center}>Search a Different Place:</Text>
          <SearchBar
            platform="ios"
            clearIcon
            icon={{name: 'home'}}
            containerStyle={{backgroundColor: 'white'}}
            placeholder="Search for a restaurant..."
            onChangeText={this.handleSearchChange}
            value={this.state.search}
            onSubmitEditing={this.handleSubmit}
          />
        </View>
        <View style={{marginBottom: 200}}>

          <Text h4 style={styles.center}>Search Results</Text>
          { this.state.isLoading ? this.isLoading() : null }
          <ScrollView>   
            {this.state.data.map((business, i) => (
              <Card key={i} title={business.name}>
                <View>
                <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 10 }}>
                    <Image style={styles.image} source={{uri: business.image_url}} />
                    <View>
                      <Text>{business.location.address1.length > 1 ? business.location.address1 : 'N/A'}</Text>
                      <Text>{business.phone.length > 1 ? business.display_phone : 'N/A'}</Text>
                      <Text>Price Range: {business.price}</Text>
                      <Text style={{color: 'blue'}} onPress={() => Linking.openURL(`${business.url}`)}>See it on yelp</Text>
                    </View>
                  </View>
                  <Button
                    raised
                    title="NOMinate" 
                    titleStyle={{ color: '#fff' }}
                    buttonStyle={{ backgroundColor: '#ffaa00' }}
                    onPress={() => {
                    this.handleAddEvent(business.name, business.id)
                  }}/>
                </View>
              </Card>
            ))}
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1
  },
  image: {
    height: 70,
    width: 70,
    marginRight: 10
  },
  center: {
    alignSelf: 'center'
  }
});