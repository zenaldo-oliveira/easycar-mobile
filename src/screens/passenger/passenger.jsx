import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
  reverseGeocodeAsync,
} from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import MyButton from "../../components/mybutton/mybutton.jsx";
import icons from "../../constants/icons.js";
import { styles } from "./passenger.style.js";

function Passenger(props) {
  const userId = 1; // ID do usuário logado (simulado
  const [myLocation, setMyLocation] = useState(null);
  const [title, setTitle] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [status, setStatus] = useState("");
  const [rideId, setRideId] = useState(0);
  const [driverName, setDriverName] = useState("");

  async function RequestRideFromUser() {
    // Acessar dados na API...
    // const response = {};

    // const response = {
    //   ride_id: 1,
    //   passenger_user_id: 1,
    //   passenger_name: "Zenaldo Hacker",
    //   passenger_phone: "(11) 99999-9999",
    //   pickup_address: "Praça alencastro",
    //   pickup_date: "2025-02-19",
    //   pickup_latitude: "-23.543132",
    //   pickup_longitude: "-46.665389",
    //   dropoff_address: "Shopping estação",
    //   status: "P",
    //   driver_user_id: null,
    //   driver_name: null,
    //   driver_phone: null,
    // };

    const response = {
      ride_id: 1,
      passenger_user_id: 1,
      passenger_name: "Zenaldo Hacker",
      passenger_phone: "(11) 99999-9999",
      pickup_address: "Praça alencastro",
      pickup_date: "2025-02-19",
      pickup_latitude: "-23.543132",
      pickup_longitude: "-46.665389",
      dropoff_address: "Shopping estação",
      status: "A",
      driver_user_id: 2,
      driver_name: "Developer desenvolvedor web",
      driver_phone: "(65) 1478-5236",
    };
    return response;
  }

  async function RequestPermissionAndGetLocation() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (!granted) {
      Alert.alert("Permissão de localização negada");
      return null;
    }

    const currentPosition = await getCurrentPositionAsync();
    return currentPosition.coords; // Retorna as coordenadas corretamente
  }

  async function RequestAddressName(lat, long) {
    const response = await reverseGeocodeAsync({
      latitude: lat,
      longitude: long,
    });

    if (
      response[0].street &&
      response[0].streetNumber &&
      response[0].district
    ) {
      setPickupAddress(
        response[0].street +
          "," +
          response[0].streetNumber +
          "-" +
          response[0].district
      );
    }
  }

  async function LoadScreen() {
    //buscar dados de corrida na API para o usuario...
    const response = await RequestRideFromUser();

    if (!response.ride_id) {
      //   const location = { latitude: -23.561747, longitude: -46.656244 };
      const location = await RequestPermissionAndGetLocation();

      if (location.latitude) {
        setTitle("Encontre a sua carona agora");
        setMyLocation(location);
        RequestAddressName(location.latitude, location.longitude);
      } else {
        Alert.alert("Não foi possível obter sua localização...");
      }
    } else {
      setTitle(
        response.status == "P"
          ? "Aguarndado uma carona..."
          : "Carona confirmada"
      );
      setMyLocation({
        latitude: Number(response.pickup_latitude),
        longitude: Number(response.pickup_longitude),
      });

      setPickupAddress(response.pickup_address);
      setDropoffAddress(response.dropoff_address);
      setStatus(response.status);
      setRideId(response.ride_id);
      setDriverName(response.driver_name + " - " + response.driver_phone);
    }
  }

  async function AskForRide() {
    if (!myLocation) {
      Alert.alert("Localização ainda não carregada!");
      return;
    }

    const json = {
      Passenger_id: userId,
      pickup_address: pickupAddress,
      dropoff_address: dropoffAddress,
      pickup_latitude: myLocation.latitude,
      pickup_longitude: myLocation.longitude,
    };

    console.log("Fazer POST para o servidor: ", json);

    props.navigation.goBack();
  }

  async function CancelRide() {
    const json = {
      passenger_user_id: userId,
      ride_id: rideId,
    };
    console.log("Cancelar carona", json);
    props.navigation.goBack();
  }

  async function FinishRide() {
    const json = {
      passenger_user_id: userId,
      ride_id: rideId,
    };
    console.log("Finalizar carona", json);

    props.navigation.goBack();
  }

  // Executa LoadScreen() ao montar o componente
  useEffect(() => {
    LoadScreen();
  }, []);

  return (
    <View style={styles.container}>
      {myLocation ? (
        <>
          {/* Mapa exibindo a localização do usuário  */}
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
            {/* Marcador no mapa representando a posição do usuário */}
            <Marker
              coordinate={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
              }}
              title="Heber Stein Mazutti"
              description="Av. Paulista, 1500"
              image={icons.location}
              style={styles.marker}
            />
          </MapView>

          <View style={styles.footer}>
            <View style={styles.footerText}>
              <Text>{title}</Text>
            </View>

            <View style={styles.footerFields}>
              <Text>Origem</Text>
              <TextInput
                style={styles.input}
                value={pickupAddress}
                onChangeText={(text) => setPickupAddress(text)}
                editable={status == "" ? true : false}
              />
            </View>

            <View style={styles.footerFields}>
              <Text>Destino</Text>
              <TextInput
                style={styles.input}
                value={dropoffAddress}
                onChangeText={(text) => setDropoffAddress(text)}
                editable={status == "" ? true : false}
              />
            </View>

            {status == "A" && (
              <View style={styles.footerFields}>
                <Text>Motorista</Text>
                <TextInput
                  style={styles.input}
                  value={driverName}
                  editable={false}
                />
              </View>
            )}
          </View>
          {status == "" && (
            <MyButton text="CONFIRMAR" theme="default" onClick={AskForRide} />
          )}

          {status == "P" && (
            <MyButton text="CANCELAR" theme="red" onClick={CancelRide} />
          )}

          {status == "A" && (
            <MyButton
              text="FINALIZAR CARONA"
              theme="red"
              onClick={FinishRide}
            />
          )}
        </>
      ) : (
        // Exibe um indicador de carregamento enquanto a localização é obtida
        <View style={styles.loading}>
          <ActivityIndicator size={"large"} />
        </View>
      )}
    </View>
  );
}

export default Passenger;
