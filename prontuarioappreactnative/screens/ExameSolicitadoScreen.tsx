import { Ionicons } from '@expo/vector-icons';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { DrawerParamList } from '../navigation/DrawerNavigator';

type Props = DrawerScreenProps<
  DrawerParamList,
  'ExamesSolicitados'
>;

export type ExameSolicitado = {
  id: number;
  nome_exame: string;
  descricao: string;
  preparo: string;
  exige_jejum: boolean;
  consulta: number;
};

const ExameSolicitadoScreen = ({
  navigation,
}: Props) => {
  const [exames, setExames] = useState<
    ExameSolicitado[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchExames = async () => {
    setLoading(true);

    const response = await fetch(
      'http://127.0.0.1:8000/exameSolicitado/api/'
    );

    const data = await response.json();

    setExames(data);
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchExames();
    }, [])
  );

  const handleDelete = async (
    id: number
  ) => {
    await fetch(
      `http://127.0.0.1:8000/exameSolicitado/api/${id}/`,
      {
        method: 'DELETE',
      }
    );

    setExames(prev =>
      prev.filter(e => e.id !== id)
    );
  };

  const renderItem = ({
    item,
  }: {
    item: ExameSolicitado;
  }) => (
    <View style={styles.card}>
      <Text style={styles.name}>
        {item.nome_exame}
      </Text>

      <Text style={styles.description}>
        Descrição: {item.descricao}
      </Text>

      <Text style={styles.description}>
        Preparo: {item.preparo}
      </Text>

      <Text style={styles.description}>
        Exige jejum:{' '}
        {item.exige_jejum ? 'Sim' : 'Não'}
      </Text>

      <Text style={styles.description}>
        Consulta ID: {item.consulta}
      </Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate(
              'EditExameSolicitado',
              {
                exame: item,
              }
            )
          }
        >
          <Text style={styles.editText}>
            Editar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            handleDelete(item.id)
          }
        >
          <Text style={styles.editText}>
            Excluir
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Exames Solicitados
      </Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#4B7BE5"
        />
      ) : (
        <FlatList
          data={exames}
          keyExtractor={item =>
            item.id.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate(
            'CreateExameSolicitado'
          )
        }
      >
        <Ionicons
          name="add"
          size={28}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#f0f4ff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  editButton: {
    backgroundColor: '#4B7BE5',
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#E54848',
    padding: 8,
    borderRadius: 6,
  },
  editText: {
    color: '#fff',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#0D47A1',
    borderRadius: 28,
    padding: 14,
    elevation: 4,
  },
});

export default ExameSolicitadoScreen;