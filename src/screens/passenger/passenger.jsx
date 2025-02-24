import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import MyButton from "../../components/mybutton/mybutton";
import icons from "../../constants/icons";
import { styles } from "./passenger.style";

function Passenger(props) {

  const [myLocation, setMyLocation] = useState({});
  const [title, setTitle] = useState("");

  async function RequestPermissionAndGetLocation() {

    const { granted } = await requestForegroundPermissionsAsync();
    console.log('Permissão concedida:', granted);  // Log para ver se a permissão foi concedida

    if (granted) {
      // Obtém a posição atual do usuário
      const currentPosition = await getCurrentPositionAsync();
      console.log('Localização obtida:', currentPosition.coords);

      if (currentPosition.coords) {
        return currentPosition.coords;
      } else {
        return {};
      }
    } else {

      return {};
    }
  }
  async function RequestRideFromUser() {
    //Busca dados de corrida aberta na API para o usuario...
    return {};

  }

  async function LoadScreen() {
    // Buscar dados de corrida aberta na API para o usuário...
    const response = await RequestRideFromUser();


    if (!response.ride_id) {
      // Chama a função para obter a localização do usuário
      const location = await RequestPermissionAndGetLocation();

      if (location.latitude) {
        setTitle("Encontre a sua carona agora");
        setMyLocation(location);

      } else {

      }

    } else {

    }
  }

  useEffect(() => {
    LoadScreen();
  }, []);

  return (
    <View style={styles.container}>
      {myLocation && myLocation.latitude ? (
        <>
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={{
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
              latitudeDelta: 0.004,
              longitudeDelta: 0.004,
            }}
          >
            <Marker
              coordinate={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
              }}
              title="Zenaldo Hackerhackeia"
              description="Av. dos bobos, 1022"
              image={icons.location}
              style={styles.marker}
            />
          </MapView>

          <View style={styles.footer}>
            <View style={styles.footerText}>
              <Text>{title}</Text>
            </View>

            <View style={styles.footerFilds}>
              <Text>Origem</Text>
              <TextInput style={styles.input} />
            </View>

            <View style={styles.footerFilds}>
              <Text>Destino</Text>
              <TextInput style={styles.input} />
            </View>
          </View>

          <MyButton text="CONFIRMAR" theme="default" />
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

export default Passenger;
