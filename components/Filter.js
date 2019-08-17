import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView, Alert, Dimensions, Linking } from 'react-native';
import { Text, ButtonGroup, CheckBox, Button, Header, Card, Image } from 'react-native-elements';
import Results from './Results.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import { YELP_API_KEY, DB_URL } from '../config.js';
import { Dropdown } from 'react-native-material-dropdown';

export default class Filter extends Component {
  constructor(props){
    super(props);
    this.state = {
      checkedReservations: false,
      checkedWheelchair: false,
      selectedPrice: 0,
      selectedMeal: 0,
      category: '',
      data: [],
      selectedBarCategory: false,
      selectedRestaurantCategory: false,
      isLoading: false,
      showFilter: true
    };
  }

  componentDidMount() {
    this.setState({ showFilter: true });
  }

  updatePrice = selectedPrice => {
    this.setState({ selectedPrice });
  }

  updateCategory = category => {
    const categories = ['Coffee', 'Desserts', 'Food Trucks', 'Juice Bars & Smoothies'];
    if (category === 'Bars') {
      this.state.selectedBarCategory = true;
      this.state.selectedRestaurantCategory = false;
    } else if (category === 'Restaurants') {
      this.state.selectedBarCategory = false;
      this.state.selectedRestaurantCategory = true;
    } else if (categories.includes(category)) {
      this.state.selectedBarCategory = false;
      this.state.selectedRestaurantCategory = false;
    }
    this.setState({ category })
  }

  getAttributes = () => {
    let attributes = []
    this.state.checkedReservations ? attributes.push('reservation'): null;
    this.state.checkedWheelchair ? attributes.push('wheelchair_accessible') : null;
    this.state.checkedHotAndNew ? attributes.push('hot_and_new') : null;

    if (attributes.length > 0) {
      let temp = attributes.join(',')
      return temp;
    }
    return '';
  }

  isLoading = () => {
    return (
      <View style={[ styles.centerLoad ]}>
        <ActivityIndicator size="large" color="#ffaa00" />
      </View>
    )
  }

  handleSubmit = () => {
    this.setState({ isLoading: true, showFilter: false })
    const location = 'Los Angeles'
    const category = this.state.category
    const price = this.state.selectedPrice + 1
    const date = '1565888400'
    const attributes =  this.getAttributes();
    let url = `https://api.yelp.com/v3/businesses/search?term=${category}&location=${location}&open_at=${date}&price=${price}&limit=5`
    
    if (attributes.length > 1) {
      url = `https://api.yelp.com/v3/businesses/search?term=${category}&location=${location}&open_at=${date}&price=${price}&limit=5&attributes=${attributes}`
    }
   
    const obj = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'Bearer ' + YELP_API_KEY
      }
    }
    
    return fetch(url, obj)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          data: responseJson.businesses,
          showResults: true
        })
      })
      .catch((error) => console.error(error));
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

  render () {
    const priceRange = ['$', '$$', '$$$'];
    const categories = [{value: 'Restaurants'}, {value: 'Bars'}, {value: 'Coffee'}, {value: 'Desserts'}, {value: 'Food Trucks'}, {value: 'Juice Bars & Smoothies'}]
    const barCategories = [{value: 'Cocktail Bars'}, {value: 'Cigar Bars'}, {value: 'Lounges'}, {value: 'Pubs'}]
    const restaurantCategories = [{value: 'Burgers'}, {value: 'Sushi'}, {value: 'Buffets'}, {value: 'Delis'}, {value: 'Pizza'}]

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
        {this.state.showFilter ? 
          (<View>
            <Text h4>Filter</Text>
            <View>
              <Text>Select Price Range:</Text>
              <ButtonGroup
                onPress={this.updatePrice}
                selectedIndex={this.state.selectedPrice}
                buttons={priceRange}
                containerStyle={{height: 30}}
                containerBorderRadius={10}
                titleStyle={{color: '#fff'}}
                selectedButtonStyle={{ backgroundColor: '#ffaa00' }}
              />
            </View>
        
            <View>
              <Text>Other Options</Text>
              <CheckBox
                title="Waitlist / Reservations"
                checkedColor={'#ffaa00'}
                checked={this.state.checkedReservations}
                onPress={() => this.setState({checkedReservations: !this.state.checkedReservations})}
              />
              <CheckBox
                checkedColor={'#ffaa00'}
                title="Wheelchair Accessible" 
                checked={this.state.checkedWheelchair} 
                onPress={() => this.setState({checkedWheelchair: !this.state.checkedWheelchair})}
              />
            </View>
        
            <View>
              <Dropdown label='Select a Category' data={categories} onChangeText={this.updateCategory}/>
              {
                this.state.selectedBarCategory ? 
                <Dropdown label='Select a Bar Category' data={barCategories} onChangeText={this.updateCategory}/> : null
              }
              {
                this.state.selectedRestaurantCategory ? 
                <Dropdown label='Select a Restaurant Category' data={restaurantCategories} onChangeText={this.updateCategory}/> : null
              }
              <Button raised title="Find me a place!"
                containerStyle={{
                  width: Dimensions.get('window').width - 20,
                  alignSelf: 'center'
                }}
                titleStyle={{ color: '#fff' }}
                buttonStyle={{ backgroundColor: '#ffaa00' }}
                onPress={this.handleSubmit}
              />
            </View>
            { this.state.showResults ? <Results data={this.state.data}/> : null }
            { this.state.isLoading ? this.isLoading() : null }
          </View>) : (
            <View style={{marginBottom: 200}}>
              <View>
                <Text style={{marginBottom: 10}}></Text>
                {/* <Button raised 
                  containerStyle={{
                    width: Dimensions.get('window').width - 20,
                    alignSelf: 'center'
                  }}
                  titleStyle={{ color: '#fff' }}
                  buttonStyle={{ backgroundColor: '#ffaa00' }}
                  title="Filter Again" 
                  onPress={() => {this.setState({ showFilter: true })}}/> */}
              </View>
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
                        titleStyle={{ color: '#fff' }}
                        buttonStyle={{ backgroundColor: '#ffaa00' }}
                        title="NOMinate" onPress={() => {
                        this.handleAddEvent(business.name, business.id)
                      }}/>
                    </View>
                  </Card>
                ))}
              </ScrollView>
            </View>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  center: {
    alignSelf: 'center'
  },
  image: {
    height: 70,
    width: 70,
    marginRight: 10
  }
});