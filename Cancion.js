import { View, Image } from "react-native";
import { Card, Text } from "react-native-paper";

export default function Objetivo(entrada, nombre, artista, portada){
    
    if (entrada.toLowerCase().includes(nombre.toLowerCase())){
        return(
            <Card>
            <Card.Content>
                <Image source={{uri: portada}}
                    style={{
                                width: 200,
                                height: 200
                }}/>
                <Text>{artista}</Text>
            </Card.Content>
            <Card.Title title={nombre}/>
            </Card>
    )
    }
    else{
        return(
        <View>
            <Text>m</Text>
        </View>)
    }
    
}