import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ActivityIndicator,
    Button,
    Card,
    Dialog,
    List,
    Portal,
    Snackbar,
    Text,
    TextInput
} from 'react-native-paper';
import * as datos from './data.json';

const STORAGE_KEY = 'replife.playlists.v1';

const getSongId = (song, index) => {
    const safeName = (song?.nombre || 'cancion').toLowerCase().replace(/\s+/g, '-');
    const safeArtist = (song?.artista || 'desconocido').toLowerCase().replace(/\s+/g, '-');
    return `${index}-${safeName}-${safeArtist}`;
};

const normalizePlaylistName = (name) => name.trim().toLowerCase();

const parsePlaylists = (value) => {
    if (!value) {
        return [];
    }

    try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .filter((playlist) =>
                playlist &&
                typeof playlist.id === 'string' &&
                typeof playlist.name === 'string' &&
                Array.isArray(playlist.songIds)
            )
            .map((playlist) => ({
                id: playlist.id,
                name: playlist.name.trim(),
                songIds: playlist.songIds.filter((songId) => typeof songId === 'string')
            }));
    } catch {
        return [];
    }
};

export default function Biblioteca() {
    const songs = useMemo(
        () => (datos.canciones || []).map((song, index) => ({ ...song, id: getSongId(song, index) })),
        []
    );

    const songsById = useMemo(() => {
        const map = {};
        songs.forEach((song) => {
            map[song.id] = song;
        });
        return map;
    }, [songs]);

    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
    const [playlistName, setPlaylistName] = useState('');
    const [loading, setLoading] = useState(true);
    const [didLoad, setDidLoad] = useState(false);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const selectedPlaylist = useMemo(
        () => playlists.find((playlist) => playlist.id === selectedPlaylistId) || null,
        [playlists, selectedPlaylistId]
    );

    const selectedSongs = useMemo(() => {
        if (!selectedPlaylist) {
            return [];
        }
        return selectedPlaylist.songIds
            .map((songId) => songsById[songId])
            .filter((song) => Boolean(song));
    }, [selectedPlaylist, songsById]);

    useEffect(() => {
        const loadPlaylists = async () => {
            try {
                const rawValue = await AsyncStorage.getItem(STORAGE_KEY);
                const parsed = parsePlaylists(rawValue);
                setPlaylists(parsed);
                if (parsed.length > 0) {
                    setSelectedPlaylistId(parsed[0].id);
                }

                if (rawValue && parsed.length === 0) {
                    setErrorMessage('No se pudo leer la librería guardada. Se cargó una librería vacía.');
                }
            } catch {
                setPlaylists([]);
                setErrorMessage('No se pudo cargar la librería.');
            } finally {
                setLoading(false);
                setDidLoad(true);
            }
        };

        loadPlaylists();
    }, []);

    useEffect(() => {
        if (!didLoad) {
            return;
        }

        const savePlaylists = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(playlists));
            } catch {
                setErrorMessage('No se pudo guardar la librería.');
            }
        };

        savePlaylists();
    }, [playlists, didLoad]);

    const createPlaylist = () => {
        const name = playlistName.trim();
        if (!name) {
            setSnackbarMessage('Ingresa un nombre para la playlist.');
            return;
        }

        const duplicated = playlists.some(
            (playlist) => normalizePlaylistName(playlist.name) === normalizePlaylistName(name)
        );

        if (duplicated) {
            setSnackbarMessage('Ya existe una playlist con ese nombre.');
            return;
        }

        const newPlaylist = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name,
            songIds: []
        };

        setPlaylists((currentPlaylists) => [newPlaylist, ...currentPlaylists]);
        setSelectedPlaylistId(newPlaylist.id);
        setPlaylistName('');
        setSnackbarMessage('Playlist creada.');
    };

    const addSongToPlaylist = (songId) => {
        if (!selectedPlaylistId) {
            return;
        }

        let alreadyExists = false;
        setPlaylists((currentPlaylists) =>
            currentPlaylists.map((playlist) => {
                if (playlist.id !== selectedPlaylistId) {
                    return playlist;
                }

                if (playlist.songIds.includes(songId)) {
                    alreadyExists = true;
                    return playlist;
                }

                return {
                    ...playlist,
                    songIds: [...playlist.songIds, songId]
                };
            })
        );

        setSnackbarMessage(alreadyExists ? 'La canción ya está en la playlist.' : 'Canción agregada.');
    };

    if (loading) {
        return (
            <View style={styles.centerContent}>
                <ActivityIndicator animating />
                <Text>Cargando playlists...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Card mode="outlined" style={styles.section}>
                <Card.Title title="Crear playlist" />
                <Card.Content>
                    <TextInput
                        mode="outlined"
                        label="Nombre de playlist"
                        value={playlistName}
                        onChangeText={setPlaylistName}
                    />
                    <Button mode="contained" style={styles.topSpace} onPress={createPlaylist}>
                        Crear
                    </Button>
                </Card.Content>
            </Card>

            {Boolean(errorMessage) && (
                <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <Card mode="outlined" style={styles.section}>
                <Card.Title title="Tus playlists" />
                <Card.Content>
                    {playlists.length === 0 ? (
                        <Text>Aún no hay playlists creadas.</Text>
                    ) : (
                        <FlatList
                            data={playlists}
                            keyExtractor={(playlist) => playlist.id}
                            renderItem={({ item }) => (
                                <List.Item
                                    title={item.name}
                                    description={`${item.songIds.length} canciones`}
                                    onPress={() => setSelectedPlaylistId(item.id)}
                                    left={(props) => (
                                        <List.Icon
                                            {...props}
                                            icon={item.id === selectedPlaylistId ? 'music-box' : 'music-box-multiple'}
                                        />
                                    )}
                                />
                            )}
                        />
                    )}
                </Card.Content>
            </Card>

            {selectedPlaylist && (
                <Card mode="outlined" style={styles.section}>
                    <Card.Title title={selectedPlaylist.name} subtitle="Canciones de la playlist" />
                    <Card.Actions>
                        <Button mode="contained-tonal" onPress={() => setPickerVisible(true)}>
                            Agregar canciones
                        </Button>
                    </Card.Actions>
                    <Card.Content>
                        {selectedSongs.length === 0 ? (
                            <Text>No hay canciones en esta playlist.</Text>
                        ) : (
                            <FlatList
                                data={selectedSongs}
                                keyExtractor={(song) => song.id}
                                renderItem={({ item }) => (
                                    <List.Item
                                        title={item.nombre}
                                        description={item.artista}
                                        left={(props) => <List.Icon {...props} icon="music-note" />}
                                    />
                                )}
                            />
                        )}
                    </Card.Content>
                </Card>
            )}

            <Portal>
                <Dialog visible={pickerVisible} onDismiss={() => setPickerVisible(false)}>
                    <Dialog.Title>Agregar canciones</Dialog.Title>
                    <Dialog.Content>
                        {!selectedPlaylist ? (
                            <Text>Selecciona una playlist.</Text>
                        ) : (
                            <FlatList
                                data={songs}
                                keyExtractor={(song) => song.id}
                                style={styles.songPicker}
                                renderItem={({ item }) => {
                                    const alreadyAdded = selectedPlaylist.songIds.includes(item.id);
                                    return (
                                        <List.Item
                                            title={item.nombre}
                                            description={item.artista}
                                            right={() => (
                                                <Button
                                                    compact
                                                    disabled={alreadyAdded}
                                                    onPress={() => addSongToPlaylist(item.id)}
                                                >
                                                    {alreadyAdded ? 'Agregada' : 'Agregar'}
                                                </Button>
                                            )}
                                        />
                                    );
                                }}
                            />
                        )}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setPickerVisible(false)}>Cerrar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Snackbar
                visible={Boolean(snackbarMessage)}
                onDismiss={() => setSnackbarMessage('')}
                duration={2000}
            >
                {snackbarMessage}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    section: {
        marginBottom: 12
    },
    topSpace: {
        marginTop: 10
    },
    songPicker: {
        maxHeight: 280
    },
    errorText: {
        color: '#B00020',
        marginBottom: 12
    }
});
