import {useState} from 'react';
import {StyleSheet, View, Image, ScrollView} from 'react-native';
import {Chip, Card, Text, ToggleButton, Button, BottomNavigation} from 'react-native-paper';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as datos from './data.json';

export default function ProfileRoute(){
        return(
            <SafeAreaProvider>
            <SafeAreaView style={{marginTop: 10}}>
            <View style={{
                flex: 1,
                overflow: 'scroll'

            }}>
                <View style={{
                    flex: .9,
                    alignItems: 'left',
                    flexDirection:'row',
                    }}>
                    <Text variant="headlineMedium">
                        Hola, otro usuario.
                    </Text>
                    <ToggleButton.Row onValueChange={value => darValue(value)} value={value}>
                        <ToggleButton icon="bell" value='left' />
                        <ToggleButton icon="email" value='right' />
                    </ToggleButton.Row>
                </View>
                <Text variant="titleLarge">
                    Selecciona
                </Text>
                
                <View style={{
                    flexDirection:'row',
                    overflow: 'scroll',
                    padding: 5
                    
                }}>
                    {
                        GenerosMusicales.map((genero,index) =>(
                            <View>
                                <Chip>{genero}</Chip>
                            </View>
                        ))
                    }

                </View>
                
                <View>
                    <Text variant="headlineSmall">
                        Canciones populares
                    </Text>
                    <Button icon="chevron-right" 
                            mode="text" 
                            onPress={() => 
                            console.log("Presionado")}>
                                Todas
                    </Button>
                </View>
                
                <View style={{
                    flexDirection:'row',
                    overflow: 'scroll',
                    padding: 5
                    
                }}>
                    {
                        Canciones.map((cancion,index) =>(
                            <View>
                                <Card>
                                    <Card.Content>
                                        <Image source={{uri: cancion.portada}}
                                            style={{
                                                        width: 200,
                                                        height: 200
                                        }}/>
                                        <Text>{cancion.artista}</Text>
                                    </Card.Content>
                                    <Card.Title title={cancion.nombre}/>
                                </Card>
                            </View>
                        ))
                    }

                </View>
                
                <BottomNavigation navigationState={{index, routes}}
                onIndexChange={setIndex}
                renderScene={renderScene}/>
                

            </View>
            </SafeAreaView>
            </SafeAreaProvider>
    )
}