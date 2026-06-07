import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { DrawerParamList } from '../navigation/DrawerNavigator';

type Props = DrawerScreenProps<
  DrawerParamList,
  'EditExameSolicitado'
>;

const EditExameSolicitadoScreen = ({
  navigation,
  route,
}: Props) => {
  const { exame } = route.params;

  const [nomeExame, setNomeExame] =
    useState('');

  const [descricao, setDescricao] =
    useState('');

  const [preparo, setPreparo] =
    useState('');

  const [exigeJejum, setExigeJejum] =
    useState(false);

  const [consulta, setConsulta] =
    useState<number>();

  const [consultas, setConsultas] =
    useState<any[]>([]);

  const [saving, setSaving] =
    useState(false);

  const fetchConsultas = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/consulta/api/'
      );

      const data = await response.json();

      setConsultas(data);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setNomeExame(exame.nome_exame);
      setDescricao(exame.descricao);
      setPreparo(exame.preparo);
      setExigeJejum(exame.exige_jejum);
      setConsulta(exame.consulta);

      fetchConsultas();
    }, [exame])
  );

  const handleSave = async () => {
    try {
      setSaving(true);

      await fetch(
        `http://127.0.0.1:8000/exameSolicitado/api/${exame.id}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            nome_exame: nomeExame,
            descricao,
            preparo,
            exige_jejum: exigeJejum,
            consulta,
          }),
        }
      );

      navigation.navigate(
        'ExamesSolicitados'
      );
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Editar Exame Solicitado
      </Text>

      <Text style={styles.label}>
        Nome do Exame
      </Text>

      <TextInput
        value={nomeExame}
        onChangeText={setNomeExame}
        style={styles.input}
      />

      <Text style={styles.label}>
        Descrição
      </Text>

      <TextInput
        value={descricao}
        onChangeText={setDescricao}
        style={[
          styles.input,
          { height: 100 },
        ]}
        multiline
      />

      <Text style={styles.label}>
        Preparo
      </Text>

      <TextInput
        value={preparo}
        onChangeText={setPreparo}
        style={[
          styles.input,
          { height: 100 },
        ]}
        multiline
      />

      <Text style={styles.label}>
        Consulta
      </Text>

      <Picker
        selectedValue={consulta}
        onValueChange={(value) =>
          setConsulta(value)
        }
      >
        {consultas.map(item => (
          <Picker.Item
            key={item.id}
            label={`Consulta ${item.id}`}
            value={item.id}
          />
        ))}
      </Picker>

      <Text style={styles.label}>
        Exige Jejum
      </Text>

      <Switch
        value={exigeJejum}
        onValueChange={setExigeJejum}
      />

      {saving ? (
        <ActivityIndicator
          size="large"
          color="#4B7BE5"
        />
      ) : (
        <Button
          title="Salvar"
          onPress={handleSave}
          color="#4B7BE5"
        />
      )}

      <Button
        title="Voltar"
        onPress={() =>
          navigation.navigate(
            'ExamesSolicitados'
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    alignSelf: 'center',
  },
  label: {
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
});

export default EditExameSolicitadoScreen;