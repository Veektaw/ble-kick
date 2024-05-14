// App.jsx
import React from 'react'
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  FlatList,
  TouchableOpacity
} from 'react-native'
import { styles } from './src/styles/styles'
import { DeviceList } from './src/DeviceList'
import useBLE from './useBLE'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const App = () => {
  const {
    isScanning,
    discoveredDevices,
    connectedDevices,
    scan,
    connect,
    disconnect
  } = useBLE()
  const isDarkMode = useColorScheme() === 'dark'
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter
  }

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{ paddingHorizontal: 20 }}>
        <Text
          style={[
            styles.title,
            { color: isDarkMode ? Colors.white : Colors.black }
          ]}>
          Please connect to your Bluetooth Glucometer
        </Text>
        <TouchableOpacity
          onPress={scan}
          activeOpacity={0.5}
          style={styles.scanButton}>
          <Text style={styles.scanButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Bluetooth Devices'}
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.subtitle,
            { color: isDarkMode ? Colors.white : Colors.black }
          ]}>
          Discovered Devices:
        </Text>
        {discoveredDevices.length > 0
          ? (
          <FlatList
            data={discoveredDevices}
            renderItem={({ item }) => (
              <DeviceList
                peripheral={item}
                connect={connect}
                disconnect={disconnect}
              />
            )}
            keyExtractor={item => item.id}
          />
            )
          : (
          <Text style={styles.noDevicesText}>No Bluetooth devices found</Text>
            )}

        <Text
          style={[
            styles.subtitle,
            { color: isDarkMode ? Colors.white : Colors.black }
          ]}>
          Connected Devices:
        </Text>
        {connectedDevices.length > 0
          ? (
          <FlatList
            data={connectedDevices}
            renderItem={({ item }) => (
              <DeviceList
                peripheral={item}
                connect={connect}
                disconnect={disconnect}
              />
            )}
            keyExtractor={item => item.id}
          />
            )
          : (
          <Text style={styles.noDevicesText}>No connected devices</Text>
            )}
      </View>
    </SafeAreaView>
  )
}

export default App
