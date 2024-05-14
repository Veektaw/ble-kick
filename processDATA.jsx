const parseReceivedData = data => {
    if (data.length !== 6 && data.length !== 12 && data.length !== 18) {
      return 'No data';
    }
  
    if (data.length === 12) {
      const initialByteCode = data[0];
      const packetLength = data[1];
      const packetType = data[2];
      let year = data[3];
      const month = data[4];
      const day = data[5];
      const hour = data[6];
      const minute = data[7];
      const second = data[8];
      // eslint-disable-next-line no-bitwise
      const glucoseValue = (data[9] << 8) | data[10];
      const checksum = data[11];
  
      if (year > 0x40) {
        year -= 0x40;
      }
  
      const parsedData =
        `Initial Byte Code: ${initialByteCode}, ` +
        `Packet Length: ${packetLength}, ` +
        `Packet Type: ${packetType}, ` +
        `Year: ${year}, ` +
        `Month: ${month}, ` +
        `Day: ${day}, ` +
        `Hour: ${hour}, ` +
        `Minute: ${minute}, ` +
        `Second: ${second}, ` +
        `Glucose Value: ${glucoseValue}, ` +
        `Checksum: ${checksum}`;
  
      return parsedData;
    } else if (data.length === 18) {
      const initialByteCode = data[0];
      const packetLength = data[1];
      const packetType = data[2];
      const mcuVersion = data[3];
      const clientCode = data[4];
      const batteryLevel = data[5];
      const mcuType = data[6];
      const mcuModel = String.fromCharCode(...data.slice(7, 16));
      const checksum = data[17];
  
      const parsedData =
        `Initial Byte Code: ${initialByteCode}, ` +
        `Packet Length: ${packetLength}, ` +
        `Packet Type: ${packetType}, ` +
        `MCU Version: ${mcuVersion}, ` +
        `Client Code: ${clientCode}, ` +
        `Battery Level: ${batteryLevel}, ` +
        `MCU Type: ${mcuType}, ` +
        `MCU Model: ${mcuModel}, ` +
        `Checksum: ${checksum}`;
  
      return parsedData;
    } else if (data.length === 6) {
      const initialByteCode = data[0];
      const packetLength = data[1];
      const packetType = data[2];
  
      if (packetLength === 0x06) {
        const seconds = data[4];
        const checksum = data[5];
  
        const parsedData =
          `Initial Byte Code: ${initialByteCode}, ` +
          `Packet Length: ${packetLength}, ` +
          `Packet Type: ${packetType}, ` +
          `Seconds: ${seconds}, ` +
          `Checksum: ${checksum}`;
  
        return parsedData;
      }
    } else {
      return 'Invalid string length';
    }
  };
  
  const extractData = parsedData => {
    const data = {};
  
    // Split the parsed data string into individual parts
    const parts = parsedData.split(', ');
  
    // Loop through each part and extract relevant information
    parts.forEach(part => {
      const [key, value] = part.split(': ');
      data[key.trim()] = value.trim();
    });
  
    // Extract specific fields and convert them to the desired format
    const year = parseInt(data.Year, 10);
    const month = parseInt(data.Month, 10);
    const day = parseInt(data.Day, 10);
    const hour = parseInt(data.Hour, 10);
    const minute = parseInt(data.Minute, 10);
    const second = parseInt(data.Second, 10);
    const glucoseValue = parseInt(data['Glucose Value'], 10);
  
    // Construct the extracted data object
    const extractedData = {
      year,
      month,
      day,
      hour,
      minute,
      second,
      glucoseValue,
    };
  
    return extractedData;
  };
  
  export default {parseReceivedData, extractData};
  