
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import MyButton from "../../components/mybutton/mybutton";
import icons from "../../constants/icons";
import { styles } from "./ride-detail.style";


function RideDetail(props) {


  const [myLocation, setMyLocation] = useState({
    latitude: -23.5475,
    longitude: -46.6361,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })


  return <View style={styles.container}>
    <MapView style={styles.map}
      provider={PROVIDER_DEFAULT}
      initialRegion={{
        latitude: -15.615343,
        longitude: -56.105181,
        latitudeDelta: 0.004,
        longitudeDelta: 0.004
      }}
    >

      <Marker coordinate={{
        latitude: -15.615343,
        longitude: -56.105181
      }}
        title="Zenaldo Hackerhackeia"
        description="Av. dos bobos, 1022"
        image={icons.location}
        style={styles.marker}
      />


    </MapView>
    <View style={styles.footer}>

      <View style={styles.footerText}>
        <Text>Encontre a sua carona</Text>
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
    <MyButton text="ACEITAR" />

  </View>
}
export default RideDetail
