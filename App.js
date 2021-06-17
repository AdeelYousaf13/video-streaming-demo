import * as React from 'react';
import {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Animated,
  PanResponder,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import Carousel from 'react-native-anchor-carousel';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Drawer = createDrawerNavigator();
const image = require('./images/BackgroundImage.jpeg');

console.disableYellowBox = true;

// console.log(React.version);

const Home = props => {
  useEffect(() => {
    setShowTv(props.route.params?.data ? true : false);
  }, [props]);

  const [pressed, setPressed] = useState(false);
  const [channelName, setChannelName] = useState('News');
  const [input, setInput] = useState(null);
  const [video, setVideo] = useState(false);
  const [showTv, setShowTv] = useState(props.route.params?.data ? true : false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [channelVideos, setChannelVideos] = useState([]);
  const [showCarousal, setShowCarousal] = useState(true);

  const channels = [
    {id: 0, name: 'News'},
    {id: 1, name: 'Music'},
    {id: 2, name: 'Life'},
    {id: 3, name: 'food'},
    {id: 4, name: 'Video'},
    {id: 5, name: 'Sports'},
    {id: 6, name: 'Games'},
  ];

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event([null, {dy: pan.y}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    }),
  ).current;

  // const carouselRef = useRef(null);
  const renderItem = ({item, index}) => {
    const {uri} = item;
    // console.log(uri);
    // console.log(input);
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.items}
        onPress={() => {
          setVideo(true);
          setShowCarousal(false);
          setVideoUrl(item?.socialLink);
          // carouselRef.current.scrollToIndex(index);
        }}>
        <ImageBackground
          source={{uri: item?.thumbnail}}
          style={styles.imageBackground}></ImageBackground>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    getChannelVideos('News');
  }, []);

  const getChannelVideos = channel => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };
    fetch('http://api.centric.nyc/v2/search/?channel=' + channel)
      .then(response => response.json())
      .then(json => setChannelVideos(json.search_result))
      .catch(error => console.error(error));
  };

  return (
    <>
      <ImageBackground
        source={image}
        resizeMode={'contain'}
        style={styles.image}>
        {showTv ? (
          <View>
            {/* style={{ */}
            {/* //   transform: [{translateY: pan.y}],
            // }}
            // {...panResponder.panHandlers}> */}
            <View style={{backgroundColor: '#FFFF', opacity: 1}}>
              <View
                style={{
                  height: 30,
                  width: '100%',
                  // alignItems: 'center',
                  justifyContent: 'center',
                  borderBottomWidth: 0.5,
                  backgroundColor: '#9428C7',
                  flexDirection: 'row',
                }}>
                <View>
                  <Text style={{color: 'white'}}>Watch TV</Text>
                </View>

                <View style={{position: 'absolute', right: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowTv(false);
                      console.log('TV Show: ', showTv);
                    }}>
                    <Icon name="close" style={{color: 'white'}} size={30} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.inputField}>
                
                <Icon name="search" style={{color: '#9428C7',marginLeft: 10}} size={21} />
                <TextInput
                  style={styles.input}
                  onChangeText={setInput}
                  value={input}
                  placeholder="Search....."
                  placeholderTextColor={'#000000'}
                  //keyboardType="numeric"
                />
              </View>

              <FlatList
                horizontal
                // pagingEnabled={true}
                // numColumns={channels.length}
                // columnWrapperStyle={styles.row}
                data={channels}
                // columnWrapperStyle={styles.row}
                renderItem={({item, index}) => (
                  <TouchableOpacity
                    style={[
                      styles.list,
                      {
                        backgroundColor:
                          channelName == item.name ? '#9428C7' : 'white',
                        borderWidth: 1,
                        borderColor: '#942Cc7',
                      },
                    ]}
                    onPress={() => {
                      setChannelName(item.name);
                      setShowCarousal(true);
                      setVideo(false);
                      getChannelVideos(item.name);
                      console.log(channelName);
                      console.log(channelVideos);
                    }}>
                    <Text
                      style={{
                        color: channelName == item.name ? 'white' : 'black',
                        alignItems: 'center',
                      }}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
              {showCarousal ? (
                <View style={styles.carouselContainer}>
                  <Carousel
                    style={styles.carousel}
                    data={channelVideos}
                    renderItem={renderItem}
                    itemWidth={0.7 * windowWidth}
                    inActiveOpacity={0.3}
                    containerWidth={windowWidth - 10}
                  />
                </View>
              ) : null}

              {video ? (
                <View style={{height: 450, marginTop: 10}}>
                  {/* {console.log(channelIndex)} */}
                  <WebView source={{uri: videoUrl}} />
                  <TouchableOpacity></TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
        ) : null}
      </ImageBackground>
    </>
  );
};

const SideDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="Watch Tv"
              onPress={() => props.navigation.navigate('Home', {data: true})}
            />
          </DrawerContentScrollView>
        );
      }}>
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <SideDrawer />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'blue',
  },
  image: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    //justifyContent: "center"
  },
  list: {
    borderWidth: 1,
    borderColor: 'green',
    backgroundColor: 'green',
    margin: 7,
    marginRight: 2,
    marginLeft: 2,
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  row: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  input: {
    
    // height: 40,
    // margin: 12,
    // borderRadius: 10,
    // paddingHorizontal: 10,
    // borderWidth: 1,
    color: 'black',
    // borderColor: '#9428C7',
    backgroundColor: 'white',
    // fontFamily: 'Roboto'
    width: '80%'
  },
  inputField: {
    flexDirection: 'row',
    borderColor: '#9428c7',
    borderWidth: 1,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    // justifyContent: 'left',
    alignItems: 'center',
    // padding: 5,
    // marginStart: 10,
    height: 50
  },
  carouselContainer: {
    height: 150,
    width: windowWidth,
    borderWidth: 5,
    borderColor: 'white',
    //backgroundColor:'white',
    marginTop: 10,
  },
  carousel: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageBackground: {
    flex: 2,
    backgroundColor: 'white',
    borderWidth: 5,
    borderColor: 'white',
  },

  items: {
    borderWidth: 2,
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 10,
    borderColor: 'white',
    elevation: 3,
  },
});

export default App;
