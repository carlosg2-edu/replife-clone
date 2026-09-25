import {useState} from 'react';
import { BottomNavigation, Text } from 'react-native-paper';

const FavoritesRoute = () => <Text>Música</Text>;
const SearchRoute = () => <Text>Buscar</Text>;
const LibraryRoute = () => <Text>Librería</Text>;
const ProfileRoute = () => <Text>Perfil</Text>;

const MyComponent = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'music', title: 'Favorites', focusedIcon: 'heart', unfocusedIcon: 'heart-outline'},
    { key: 'albums', title: 'Albums', focusedIcon: 'album' },
    { key: 'recents', title: 'Recents', focusedIcon: 'history' },
    { key: 'notifications', title: 'Notifications', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    music: FavoritesRoute,
    albums: SearchRoute,
    recents: LibraryRoute,
    notifications: ProfileRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default MyComponent;