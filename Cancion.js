import { View, Image } from "react-native";
import { Card, Text } from "react-native-paper";

export default function Cancion(nombre, artista, album, genero, portada){
    return(
        <View>
            <Card>
                <Card.Content>
                    <Image source={{uri: portada}}
                           style={{
                                    width: 200,
                                    height: 200
                    }}/>
                </Card.Content>
                <Card.Title title={nombre}/>
            </Card>
        </View>
    )
}