import { View,Text, StyleSheet,Pressable, Image, StatusBar} from "react-native";
import { Link } from "expo-router";
const App = () => {
  console.log("✅ Index screen rendered"); // This should show up in logs
  return (
    <View style = {styles.container}>
       <StatusBar backgroundColor="#004158" barStyle="light-content" />
      <View style={styles.separator}/>
      {/* <Text style = {styles.title}> Get Things Done With</Text> */}
      <Text style = {styles.title2}>VolunTrack</Text> 

      <Image source={require("@/assets/images/vt.png")} style={styles.image} />

      <Text style = {styles.welcome}> Empowering organizations and volunteers to create a lasting impact together.</Text>
   {/* <Link href="/supervisor/SupervisorDashboard" style = {styles.link2} asChild> */}
    {/* <Link href="/volunteer/VolunteerDashboard" style = {styles.link} asChild> */}
     <Link href="/Login" style = {styles.link} asChild>
     {/* <Link href="/training" style = {styles.link} asChild> */}
     <Pressable style= {styles.button}> 
      <Text style = {styles.buttonText}>Get Started </Text>
      </Pressable>
      </Link>  
      {/* <Link href="/supervisor/SupervisorDashboard" style = {styles.link2} asChild>
     <Pressable style= {styles.button}> 
      <Text style = {styles.buttonText}>Get Started </Text>
      </Pressable>
      </Link>   */}
      </View>
  );
}
 
export default App 

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'tan',
    alignItems: 'center',
  },
  image: {
    width: 170, // Adjust width
    height: 170, // Adjust height
    // resizeMode: "contain",
    marginTop: 175,
    marginLeft: 20,
    marginBottom: 100,
    borderRadius: 70,
    },

  // title: {
  //   color: 'white',
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  //   marginBottom: 390,
  //   // marginTop: 10,
  // },
  title2: {
    color: '#004158',
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: -150,
    marginTop: 120,
  }, 
  welcome: {
    color: '#004158',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    // marginTop: -100,
    marginBottom: 30,
  },
  link: { 
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'none',
    padding: 4,
    marginHorizontal: 'auto',
    marginTop: -10,
  },
  link2: { 
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    textDecorationLine: 'none',
    padding: 4,
    marginHorizontal: 'auto',
    marginTop: 10,
  },
  button: {
    height: 60,
    width: 240,
    borderRadius: 20,
    backgroundColor: '#004158',
    padding: 6,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 4,
    },
    separator: {
      height: 1, // Fine line thickness
      backgroundColor: 'white',
      width: '100%',
    },
})