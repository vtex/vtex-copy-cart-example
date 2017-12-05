import React from 'react'
import { StyleSheet, Text, View, Button, Image, Linking } from 'react-native'

import { convertDictionaryToQueryString } from './urlUtils'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
    }
    this.onPressCheckout = this.onPressCheckout.bind(this)
  }
  componentDidMount() {
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
    console.log('render App')

    const order = this.state.order

    return (
      <View style={styles.container}>
        {order ? (
          <Text style={styles.topLabel}>Order ID: {order.orderFormId}</Text>
        ) : null}
        <Image
          style={styles.itemImage}
          source={{
            uri: 'https://instoreqa.vteximg.com.br/arquivos/ids/155403-220-220',
          }}
        />
        <Text style={styles.label}>2 trimedais</Text>
        <Button
          onPress={this.onPressCheckout}
          style={styles.button}
          title="Fechar a venda"
          color="#841584"
          accessibilityLabel="Fechar a venda"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: '90%',
    marginTop: 20,
    marginBottom: 20,
  },
  topLabel: {
    fontSize: 12,
    marginBottom: 20,
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
    borderWidth: 1,
    borderColor: '#841584',
  },
})
