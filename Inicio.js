import {useState} from 'react';
import {Text,BottomNavigation} from 'react-native-paper';
import Favoritos from './Favoritos';
import Search from './Buscar';
import Biblioteca from './Biblioteca';

const FavoritesRoute = () => <Favoritos/>;
const SearchRoute = () => <Search/>;
const LibraryRoute = () => <Biblioteca/>;
const ProfileRoute = () => <Text>Perfil</Text>;


const Inicio = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        {key:'music', title: 'Favoritos', focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
        {key:'search', title: 'Buscar', focusedIcon: 'card-search'},
        {key:'library', title: 'Librería', focusedIcon: 'music-box-multiple'},
        {key:'profile', title: 'Perfil', focusedIcon: 'account', unfocusedIcon: 'account-outline'}
    ])

    const renderScene = BottomNavigation.SceneMap({
        music: FavoritesRoute,
        search: SearchRoute,
        library: LibraryRoute,
        profile: ProfileRoute,
    })

    return(
                <BottomNavigation 
                navigationState={{index, routes}}
                onIndexChange={setIndex}
                renderScene={renderScene}
                />
    )
}

export default Inicio;