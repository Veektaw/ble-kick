import { useState, useEffect } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'
import { BleManager, Device } from 'react-native-ble-plx'
import { writeCurrentDateTimeToDevice } from './writeBLE'

const useBLE = () => {
  const [isScanning, setIsScanning] = useState(false)
  const [connectedDevices, setConnectedDevices] = useState([])
  const [discoveredDevices, setDiscoveredDevices] = useState([])
  const bleManager = new BleManager()

  const handleLocationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE
        ])

        if (
          Object.values(granted).every(
            permission => permission === PermissionsAndroid.RESULTS.GRANTED
          )
        ) {
          console.log('Location and Bluetooth permissions granted')
        } else {
          console.log('Location and/or Bluetooth permissions denied')
        }
      } catch (error) {
        console.error('Error requesting permissions:', error)
      }
    }
  }

  useEffect(() => {
    handleLocationPermission()

    const subscription = bleManager.onStateChange(state => {
      if (state === 'PoweredOn') {
        console.log('Bluetooth is turned on!')
        startScanning()
      }
    }, true)

    return () => {
      subscription.remove()
      bleManager.stopDeviceScan()
    }
  }, [])

  const startScanning = async () => {
    if (!isScanning) {
      try {
        setIsScanning(true)
        await bleManager.startDeviceScan(null, null, handleDiscover)
        console.log('Scanning...')
      } catch (error) {
        console.error('Error while scanning:', error)
      }
    }
  }

  const handleDiscover = (error, device) => {
    if (error) {
      console.error('Error while scanning:', error)
      return
    }
    setDiscoveredDevices(prevDevices => {
      if (!prevDevices.some(prevDevice => prevDevice.id === device.id)) {
        if (device.name === 'Samico GL') {
          connectToDevice(device)
        }
        return [...prevDevices, device]
      }
      return prevDevices
    })
  }

  const connectToDevice = async device => {
    try {
      const connectedDevice = await Device.connect(device.id)
      console.log('Connected to the BLE device successfully:', connectedDevice.id)

      // Wait for another 5 seconds before calling writeCurrentDateTimeToDevice function
      await delay(5000)

      // Call the writeCurrentDateTimeToDevice function
      await writeCurrentDateTimeToDevice(device.id)

      setIsScanning(false)
      console.log('Scan stopped')
    } catch (error) {
      console.error('Failed to connect to the BLE device:', error)
    }
  }

  const delay = async milliseconds => {
    return await new Promise(resolve => {
      setTimeout(resolve, milliseconds)
    })
  }

  return {
    isScanning,
    discoveredDevices,
    connectedDevices
  }
}

export default useBLE
