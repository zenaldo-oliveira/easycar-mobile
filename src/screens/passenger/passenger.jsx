import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import MyButton from "../../components/mybutton/mybutton";
import icons from "../../constants/icons";
import { styles } from "./passenger.style";

function Passenger(props) {
  const [myLocation, setMyLocation] = useState(null);
  const [title, setTitle] = useState("");
  const [markers, setMarkers] = useState([
    {
      id: 1,
      title: "Origem",
      description: "Av. Paulista, 1500",
      coordinate: { latitude: -23.561747, longitude: -46.656244 },
    },
    {
      id: 2,
      title: "Destino",
      description: "Rua dos Três Irmãos, 123",
      coordinate: { latitude: -23.550520, longitude: -46.633308 },
    },
  ]);

  // Função simulada para buscar a corrida (Você pode implementá-la conforme sua lógica)
  async function RequestRideFromUser() {
    // Lógica para buscar a corrida
  }

  // Função para pedir permissão e obter a localização
  async function RequestPermissionAndGetLocation() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();

      if (currentPosition.coords)
        return currentPosition.coords;
      else
        return {};
    } else {
      Alert.alert("Permissão de localização negada", "Não foi possível acessar sua localização.");
      return {};
    }
  }

  // Função para carregar dados e atualizar a tela
  async function LoadScreen() {
    await RequestRideFromUser();

    const location = await RequestPermissionAndGetLocation();

    if (location.latitude) {
      // Atualiza o título da tela com o endereço do local de partida
      setTitle("Encontre a sua carona agora");
      setMyLocation(location);
    } else {
      Alert.alert("Erro", "Não foi possível obter sua localização.");
    }
  }

  // UseEffect para carregar dados na inicialização
  useEffect(() => {
    LoadScreen();
  }, []);

  return (
    <View style={styles.container}>
      {myLocation ? (
        <>
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={{
              latitude: myLocation.latitude,
              longitude: myLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {/* Marcador da localização do usuário */}
            <Marker
              coordinate={{
                latitude: myLocation.latitude,
                longitude: myLocation.longitude,
              }}
              title="Sua localização"
              description="Onde você está agora"
              image={icons.location}
              style={styles.marker}
            />

            {/* Marcadores de Origem e Destino */}
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={marker.coordinate}
                title={marker.title}
                description={marker.description}
                image={icons.location}
                style={styles.marker}
              >
                {/* Mensagens dentro do marcador */}
                <View style={styles.markerContent}>
                  <Text>{marker.title}</Text>
                  <Text>{marker.description}</Text>
                </View>
              </Marker>
            ))}
          </MapView>

          <View style={styles.footer}>
            <View style={styles.footerText}>
              <Text>{title}</Text>
            </View>

            <View style={styles.footerFields}>
              <Text>Origem</Text>
              <TextInput style={styles.input} />
            </View>

            <View style={styles.footerFields}>
              <Text>Destino</Text>
              <TextInput style={styles.input} />
            </View>
          </View>

          <MyButton text="CONFIRMAR" theme="default" />
        </>
      ) : (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

export default Passenger;
