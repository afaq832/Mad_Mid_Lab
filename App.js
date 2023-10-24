import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import ApiComponent from "./component/ApiComponent";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [bitcoinData, setBitcoinData] = useState(null);


  const fetchBitcoinData = async () => {
    try {
      const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
      const data = await response.json();
      setBitcoinData(data);

     
      await AsyncStorage.setItem('bitcoinData', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching Bitcoin data:', error);
    }
  };

  const loadBitcoinDataFromStorage = async () => {

    const storedData = await AsyncStorage.getItem('bitcoinData');
    if (storedData) {
      setBitcoinData(JSON.parse(storedData));
    } else {
      fetchBitcoinData(); 
    }
  };

  useEffect(() => {
    loadBitcoinDataFromStorage();
  }, []);
  return (
		<View style={styles.container}>
     <Text>Bitcoin Rate Data:</Text>
      {bitcoinData ? (
        <FlatList
          data={Object.entries(bitcoinData.bpi)}
          keyExtractor={(item) => item[0]}
          renderItem={({ item }) => (
            <View>
              <Text>{item[1].description}</Text>
              <Text>Rate: {item[1].rate}</Text>
            </View>
          )}
        />
      ) : (
        <Text>Loading data...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
