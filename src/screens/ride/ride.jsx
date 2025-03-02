import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { json_rides } from "../../constants/dados.js";
import icons from "../../constants/icons.js";
import { styles } from "./ride.style.js";

function Ride(props) {
  // userId representa o id do usuario logado no app.
  const userId = 2; // id. do usuario logado no app (vem do login)
  const [rides, setRides] = useState([]);

  function ClickRide(id) {
    console.log("Ride=" + id);
    props.navigation.navigate("ride-detail", {
      rideId: id,
      userId: userId,
    });
  }

  async function RequestRides() {
    // Acessar dados na API em busca das caronas...
    setRides(json_rides);
  }

  useEffect(() => {
    RequestRides();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={rides}
        keyExtractor={(ride) => ride.ride_id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.ride}
              onPress={() => ClickRide(item.ride_id)}
            >
              <View style={styles.containerName}>
                <Image source={icons.car} style={styles.car} />
                <Text style={styles.name}>{item.passenger_name}</Text>
              </View>
              <Text style={styles.address}>Origem: {item.pickup_address}</Text>
              <Text style={styles.address}>
                Destino: {item.dropoff_address}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
export default Ride;
