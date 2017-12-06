import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  Dimensions,
  StatusBar,
} from 'react-native'
import { Constants, Font, ScreenOrientation } from 'expo'
import { Ionicons } from '@expo/vector-icons'
import { Button } from 'react-native-elements'

import { convertDictionaryToQueryString } from './urlUtils'

const { height: screenHeight, width: screenWidth } = Dimensions.get('window')

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      fontLoaded: false,
    }
    this.onPressCheckout = this.onPressCheckout.bind(this)
  }
  async componentDidMount() {
    ScreenOrientation.allow(ScreenOrientation.Orientation.PORTRAIT_UP)

    fetch(
      'http://api.vtex.com/instore/functions/vtex.instore-functions-example-cart-v0/run?workspace=beta',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(result => result.json())
      .then(({ order }) => {
        this.setState({
          order,
        })
      })
      .catch(e =>
        this.setState({
          error: `Error on getting new orderForm: ${e.message || e.toString()}`,
        })
      )

    await Font.loadAsync({
      'Fabriga-Bold': require('./assets/fonts/Fabriga-Bold.otf'),
      'Fabriga-BoldItalic': require('./assets/fonts/Fabriga-BoldItalic.otf'),
      'AvenirNextCondensed-Bold': require('./assets/fonts/AvenirNextCondensed-Bold.ttf'),
    })

    this.setState({ fontLoaded: true })
  }

  getInstoreUrl(order) {
    const params = {
      orderFormId: order.orderFormId,
      forceIdentification: true,
      next: 'payment',
    }
    return `instore://cart-change/?${convertDictionaryToQueryString(params)}`
  }

  onPressCheckout() {
    const order = this.state.order

    console.log(`Checkout do pedido ${order.orderFormId}`)

    const url = this.getInstoreUrl(order)

    Linking.openURL(url)
      .then(data => {
        console.log(`APPLINKING opened url: ${url}, data: ${data}`)
      })
      .catch(e => {
        console.warn('APPLINKING error on opening url: ', url, e)
      })
  }

  render() {
    const order = this.state.order

    console.log('render App', order && order.orderFormId)

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <StatusBar backgroundColor="#141f32" barStyle="light-content" />
          <View style={styles.header}>
            <View style={styles.headerSearch}>
              <Ionicons name="ios-search" size={24} color="white" />
            </View>
            {this.state.fontLoaded ? (
              <Text style={styles.headerText}>IMPÉRIO DA CEREJA</Text>
            ) : null}
            <View style={styles.headerCart}>
              <Ionicons name="md-cart" size={24} color="white" />
            </View>
          </View>
        </View>
        <View style={styles.bodyContainer}>
          {/* <Image
            style={styles.itemImage}
            source={require('assets/images/cart-image.png')}
          /> */}
          <Text style={styles.label}>2 trimedais</Text>
        </View>
        <Button
          onPress={this.onPressCheckout}
          buttonStyle={styles.buttonContainer}
          textStyle={styles.buttonText}
          title="COMPRAR"
          accessibilityLabel="COMPRAR"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
  },
  headerText: {
    fontFamily: 'AvenirNextCondensed-Bold',
    fontSize: 21,
    color: 'white',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    height: 66 + Constants.statusBarHeight,
    paddingTop: Constants.statusBarHeight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141f32',
  },
  headerSearch: {
    position: 'absolute',
    flex: 1,
    left: 14,
    top: Constants.statusBarHeight + 19,
    height: 24,
  },
  headerCart: {
    position: 'absolute',
    flex: 1,
    right: 14,
    top: Constants.statusBarHeight + 19,
    height: 24,
  },
  buttonContainer: {
    width: screenWidth - 28,
    backgroundColor: '#e3145e',
    marginBottom: 14,
    borderBottomWidth: 4,
    borderColor: '#830a36',
  },
  buttonText: {
    color: 'white',
  },
  bodyContainer: {
    flex: 1,
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    fontSize: 20,
  },
  itemImage: {
    width: 220,
    height: 220,
    backgroundColor: '#FFF',
  },
})
