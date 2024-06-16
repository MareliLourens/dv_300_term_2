import { StyleSheet, Text, View, Button, SafeAreaView, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getCategories } from '../services/DbService';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../firebase';
import moment from 'moment';

const HomeScreen = ({ navigation }) => {
  const [CategoryItems, setCategoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [remainingTimes, setRemainingTimes] = useState({});

  useEffect(() => {
    handleGettingOfData();
  }, []);

  useEffect(() => {

    const interval = setInterval(updateRemainingTimes, 1000);

    return () => clearInterval(interval);
  }, [CategoryItems]);

  const handleGettingOfData = async () => {
    try {
      setLoading(true);
      var allData = await getCategories();
      console.log("All data: ", allData);

      // Fetch image URLs for each category
      const allDataWithImages = await Promise.all(allData.map(async (item) => {
        const imageUrl = await fetchImage(item.imagePath);
        return { ...item, imageUrl };
      }));

      setCategoryItems(allDataWithImages);
      setLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error("Error fetching categories or images: ", error);
      setLoading(false);
      setIsRefreshing(false);
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

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY === 0 && !isRefreshing) {
      setIsRefreshing(true);
      handleGettingOfData();
    }
  };

  const updateRemainingTimes = () => {
    const updatedRemainingTimes = {};

    CategoryItems.forEach(item => {
      try {


        const timestamp = item.time_remaining;
        const endTime = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

        endTime.setHours(endTime.getHours() + 2);

        const now = moment();

        const timeDiff = endTime.getTime() - now.valueOf();

        if (timeDiff > 0) {
          const duration = moment.duration(timeDiff);
          const days = duration.days();
          const hours = duration.hours();
          const minutes = duration.minutes();
          const seconds = duration.seconds();

          updatedRemainingTimes[item.name] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
          updatedRemainingTimes[item.name] = "Expired";
        }
      } catch (error) {
        updatedRemainingTimes[item.name] = "Error";
      }
    });

    setRemainingTimes(updatedRemainingTimes);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.stickyHeader}>
        <Text style={styles.welcome}>Welcome back</Text>
        <Image style={styles.image} source={require('../assets/menu_button.png')} />
      </View>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ padding: 20, paddingTop: 80 }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Text style={styles.top}>Top Competitions</Text>
            <ScrollView horizontal={true} style={styles.scrollView}>
              {CategoryItems.map((item, index) => (
                <TouchableOpacity key={index} style={styles.box} onPress={() => navigation.navigate("Details", { item })}>
                  {item.imageUrl && (
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.location_image}
                    />
                  )}
                  <Text style={styles.text}>{item.name}</Text>
                  <Image style={styles.location_icon} source={require('../assets/location.png')} />
                  <Text style={styles.subtitle}>{item.location}</Text>
                  <Image style={styles.location_icon} source={require('../assets/entries.png')} />
                  <Text style={styles.subtitle}>{item.entries}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.cta} onPress={() => navigation.navigate('Entries')}>
              <Image style={styles.cta_image} source={require('../assets/cta.png')} />
              <Text style={styles.cta_top}>Enter now!</Text>
              <Text style={styles.cta_subtitle}>Join to win a trip to your dream destination!</Text>
            </TouchableOpacity>
            <Text style={styles.top}>Time Remaining</Text>
            {CategoryItems.map((item, index) => (
              <View style={styles.countdown} onPress={() => navigation.navigate('Entries')}>
                <Text style={styles.countdownname}>{item.name}</Text>
                <Text style={styles.countdowntext}>{remainingTimes[item.name]}</Text>
              </View>

            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    paddingTop: 20,
    paddingLeft: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  image: {
    height: 25,
    width: 25,
    alignItems: 'center',
    position: 'absolute',
    top: 45,
    right: 20,
  },
  top: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  scrollView: {
    height: 275,
  },
  box: {
    width: 200,
    height: 250,
    marginRight: 10,
    marginTop: 5,
    backgroundColor: 'white',
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginLeft: 5,
  },
  text: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10,
  },
  location_image: {
    height: 150,
    width: 200,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  location_icon: {
    height: 17,
    width: 17,
    marginTop: 7,
    marginLeft: 17,
  },
  subtitle: {
    fontSize: 16,
    color: '#A9A9A9',
    marginTop: -20,
    marginLeft: 37,
  },
  cta: {
    width: "100%",
    height: 85,
    backgroundColor: '#003680',
    borderRadius: 25,
  },
  cta_image: {
    height: 85,
    width: 125,
    position: "absolute",
    right: 5,
    top: -3,
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
    width: 200,
    color: 'white',
    marginTop: -5,
    marginLeft: 15,
  },
  remainingTime: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
    marginLeft: 10,
  },
  countdown: {
    width: "100%",
    height: 85,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FFBF5E',
    marginTop: 15,
    marginBottom: 5,
  },
  countdownname: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  countdowntext: {
    color: 'black',
    fontSize: 20,
    marginLeft: 10,
  },
});


