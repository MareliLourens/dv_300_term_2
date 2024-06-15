import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import { getEntries, updateEntryVote, updateEntryVoter } from '../services/DbService';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage, auth } from '../firebase';

const DetailsScreen = ({ route, navigation }) => {
    const { item } = route.params;

    useEffect(() => {
        handleGettingEntriesWithImages(item.id);
    }, []);

    const [entries, setEntries] = useState([]);
    const [leaderName, setLeaderName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [votedEntries, setVotedEntries] = useState([]);

    useEffect(() => {
        findLeader(entries);
    }, [entries]);

    const handleGettingEntriesWithImages = async (categoryId) => {
        try {
            setIsLoading(true);
            const entriesData = await getEntries(categoryId);

            const entriesWithImages = await Promise.all(entriesData.map(async (entry) => {
                const imageUrl = await fetchImage(entry.imagePath);
                return { ...entry, imageUrl };
            }));

            setEntries(entriesWithImages);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching entries or images: ", error);
            setIsLoading(false);
        }
    };

    const fetchImage = async (imagePath) => {
        try {
            const storageRef = ref(storage, imagePath);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error("Error fetching image from Firebase Storage: ", error);
            return null;
        }
    };

    const handleVote = async (categoryId, entryId, newVoteCount) => {
        try {
            // Ensure user is logged in
            const user = auth.currentUser;
            if (!user) {
                console.error("User is not logged in");
                return;
            }

            // Check if user has already voted for this entry
            if (votedEntries.includes(entryId)) {
                Alert.alert("Already Voted", "You have already voted for this entry.");
                return;
            }

            // Update vote count in the database
            await updateEntryVote(categoryId, entryId, newVoteCount);

            // Update voter details in 'users' collection
            await updateEntryVoter(categoryId, entryId, user.uid);

            // Update voted entries state
            setVotedEntries([...votedEntries, entryId]);

            // Retrieve updated entries data after the vote
            const updatedEntriesData = await getEntries(categoryId);

            // Update the entries array with the new vote counts
            const updatedEntries = updatedEntriesData.map(updatedEntry => {
                const existingEntry = entries.find(entry => entry.id === updatedEntry.id);
                return existingEntry ? { ...existingEntry, votes: updatedEntry.votes } : updatedEntry;
            });

            // Sort the updated entries array based on votes in descending order
            updatedEntries.sort((a, b) => b.votes - a.votes);

            // Update state with the sorted entries
            setEntries(updatedEntries);
        } catch (error) {
            console.error("Error updating vote count or voter information in the database: ", error);
            Alert.alert("Error", "Failed to update vote count or voter information. Please try again later.");
        }
    };

    const findLeader = (entries) => {
        if (entries.length > 0) {
            const leader = entries.reduce((prev, current) => (prev.votes > current.votes) ? prev : current, {});
            setLeaderName(leader.name);
        }
    };

    const handleScroll = (event) => {
        const { y } = event.nativeEvent.contentOffset;
        if (y <= 0) {
            // If user scrolls up (or reaches the top), refresh the page
            handleGettingEntriesWithImages(item.id);
        }
    };
    return (
        <View style={styles.container}>
            <ImageBackground style={styles.image} source={{ uri: item.imageUrl }} />
            {isLoading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
            <ScrollView contentContainerStyle={styles.scrollContent} onScroll={handleScroll}>
                <View style={styles.styledView_big}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.text}>{item.name}</Text>
                        <View style={styles.right}>
                            <Image style={styles.location_icon} source={require('../assets/location_white.png')} />
                            <Text style={styles.subtitle}>{item.location}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('Entries')}>
                        <Image style={styles.cta_image} source={require('../assets/cta_detailed.png')} />
                        <Text style={styles.cta_top}>Enter now!</Text>
                        <Text style={styles.cta_subtitle}>Join to win a trip to {item.location} </Text>
                    </TouchableOpacity>
                    <View style={styles.leader}>
                        <Image style={styles.leader_image} source={require('../assets/leader.png')} />
                        <Text style={styles.leader_top}>Leader:</Text>
                        <Text style={styles.leader_subtitle}>{leaderName}</Text>
                    </View>
                    <Text style={styles.text}>Entries:</Text>
                    <View style={styles.entriesBlock}>
                        {entries.length > 0 ? (
                            entries.map((entry) => (
                                <View style={styles.entryBubble} key={entry.id}>
                                    <Text style={styles.entryText}>{entry.name}</Text>
                                    <View style={styles.right_votes}>
                                        <Text style={styles.entryVotes}>{entry.votes} Votes</Text>
                                    </View>

                                    <Image
                                        source={{ uri: entry.imageUrl }}
                                        style={styles.entryImage}
                                    />
                                    <TouchableOpacity style={styles.vote_button} onPress={() => handleVote(item.id, entry.id, (+entry.votes) + 1)}>
                                        <Text style={styles.votesText}>Vote</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <Text>No Entries Yet</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default DetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#003680',
    },
    scrollContent: {
        paddingTop: 300,
        zIndex: 1,
    },
    image: {
        height: 350,
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
    },
    text: {
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginLeft: 25,
    },
    styledView_big: {
        backgroundColor: 'white',
        borderTopRightRadius: 35,
        borderTopLeftRadius: 35,
        marginTop: -50,
        zIndex: 2,
        minHeight: 1000,
    },
    contentContainer: {
        justifyContent: 'center',
        zIndex: 2,
    },
    right: {
        position: 'absolute',
        bottom: 0,
        right: 25,
        display: "flex",
        width: 100,
        height: 35,
        borderRadius: 25,
        backgroundColor: "#FFBF5E",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
    },
    location_icon: {
        height: 17,
        width: 17,
    },
    subtitle: {
        fontSize: 16,
        color: 'white',
        textAlign: "right",
        marginLeft: 5
    },
    cta: {
        width: "89%",
        height: 85,
        backgroundColor: '#003680',
        borderRadius: 25,
        marginTop: 20,
        marginLeft: 19,
    },
    cta_image: {
        height: 85,
        width: 150,
        position: "absolute",
        right: 12,
        top: 0,
        resizeMode: 'contain',
    },
    cta_top: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 7,
        marginLeft: 15,
        marginBottom: 5,
        color: "white",
    },
    cta_subtitle: {
        fontSize: 14,
        width: 150,
        color: 'white',
        marginTop: -5,
        marginLeft: 15,
    },
    entriesBlock: {
        marginTop: 10,
        paddingHorizontal: 20,
    },
    entryBubble: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginVertical: 5,
        borderRadius: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    entryText: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        marginBottom: 10,
    },
    entryImage: {
        height: 300,
        width: '100%',
        resizeMode: 'contain',
    },
    leader: {
        width: "89%",
        height: 85,
        backgroundColor: '#FFBF5E',
        borderRadius: 25,
        marginTop: 10,
        marginLeft: 19,
    },
    leader_image: {
        height: 85,
        width: 150,
        position: "absolute",
        right: 0,
        top: 0,
        resizeMode: 'contain',
    },
    leader_top: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 7,
        marginLeft: 15,
        marginBottom: 5,
        color: "white",
    },
    leader_subtitle: {
        fontSize: 24,
        width: 150,
        color: 'white',
        marginTop: -5,
        marginLeft: 15,
    },
    right_votes: {
        position: 'absolute',
        top: 15,
        right: 10,
        display: "flex",
        width: 90,
        height: 30,
        borderRadius: 25,
        backgroundColor: "#FFBF5E",
        alignItems: 'center',
        paddingTop: 4,
    },
    entryVotes: {
        fontSize: 15,
        flex: 1,
        color: 'white',
    },
    vote_button: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        borderWidth: 3,
        borderColor: '#FFBF5E',
        marginTop: 15,
        color: 'black',
    },
    votesText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
