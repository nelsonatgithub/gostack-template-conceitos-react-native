import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import api from "./services/api";

const createProjectCard = ({
  repoItem,
  onClickLikeButton,
}) => (
    <View style={styles.repositoryContainer}>
      <Text style={styles.repository}>{repoItem.title}</Text>

      <View style={styles.techsContainer}>
        <FlatList
          data={repoItem.techs}
          keyExtractor={(item, index) => `${item}-${index}`}
          renderItem={({ item }) => (<Text style={styles.tech}>{item}</Text>)}
        />
      </View>

      <View style={styles.likesContainer}>
        <Text
          style={styles.likeText}
          testID={`repository-likes-${repoItem.id}`}
        >
          {`${repoItem.likes} curtidas`}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => onClickLikeButton(repoItem.id)}
        testID={`like-button-${repoItem.id}`}
      >
        <Text style={styles.buttonText}>Curtir</Text>
      </TouchableOpacity>
    </View>
  );

export default function App() {
  const [repositoryList, setRepoList] = useState([]);

  useEffect(() => {
    api.get('repositories').then(response => {
      setRepoList(response.data);
    });
  }, []);

  async function handleLikeRepository(id) {
    api.post(`repositories/${id}/like`).then(({ data: repoItem }) => {
      setRepoList([
        ...repositoryList.filter(item => item.id !== id),
        repoItem,
      ]);
    });
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositoryList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => createProjectCard({
            repoItem: item,
            onClickLikeButton: (id) => { handleLikeRepository(id); },
          })}
        />
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
