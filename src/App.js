import React, {useState, useEffect} from "react";
import api from "./services/api";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {

  const [repositories, setRepositories] = useState([]);

  useEffect(()=>{
    api.get('repositories').then(response => {
      console.log(response.data);
      setRepositories(response.data);
    });
  },[]);


  async function handleLikeRepository(id) {
    const repoIndex = repositories.findIndex(repo => repo.id === id);
    if (repoIndex < 0){
      console.log(`Repository ${id} not found`);
      return;
    }
    api.post(`repositories/${id}/like`).then(response => {
      console.log(response.data);
    });

    let repositoriesNew = repositories;
    const { url, title, techs, likes } = repositories[repoIndex];
    const modifiedRepo = {id, url, title, techs, likes: likes + 1};
    repositoriesNew[repoIndex] = modifiedRepo;
    
    setRepositories([...repositoriesNew]);
    repositoriesNew=[];
    
    //setRepositories([...repositories.filter(r => r.id !== id),modifiedRepo]);
    //console.log(repositories.splite(1))
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <View style={styles.repositoryContainer}>
          <FlatList
            data={repositories}
            keyExtractor={repo => repo.id}
            renderItem={({item}) => (
              <>
                <Text style={styles.repository}>{item.title}</Text>
                <View style={styles.techsContainer}>
                  <Text style={styles.tech}>ReactJS</Text>
                  <Text style={styles.tech}>Node.js</Text>
                </View>
                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
                    testID={`repository-likes-${item.id}`}
                  >
                    {item.likes} curtidas
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(item.id)}
                  testID={`like-button-${item.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>                

              </>

  
            )}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
