import {useState} from 'react';
import {StyleSheet, View, Image, ScrollView} from 'react-native';
import {Chip, Card, Text, ToggleButton, Button, BottomNavigation, TextInput} from 'react-native-paper';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Objetivo from './Cancion';
import * as datos from './data.json';

const canciones = datos.canciones;

export default function Search(){
    const [text, setText] = useState("");
    return(
        <View style={{
            flex: 1,
            }}>
            <TextInput
            label="Busca una canción..."
            value={text}
            onChangeText={text => setText(text)}
            />
            <Text>{text}</Text>
            <ScrollView>
            {
                canciones.forEach((cancion, index) =>(
                    <Objetivo key={index} entrada={text} nombre={cancion.nombre} artista={cancion.artista} portada={cancion.portada}/>
                ))
            }
            </ScrollView>
        </View>
    )
}