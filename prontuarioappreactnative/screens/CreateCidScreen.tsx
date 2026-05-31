import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
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
  'CreateCid'
>;

const CreateCidScreen = ({
  navigation,
}: Props) => {
  const [codCid, setCodCid] =
    useState('');

  const [descricao, setDescricao] =
    useState('');

  const [sintomas, setSintomas] =
    useState('');

  const [tipo, setTipo] =
    useState('');

  const [statusAtivo, setStatusAtivo] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      setCodCid('');
      setDescricao('');
      setSintomas('');
      setTipo('');
      setStatusAtivo(true);
    }, [])
  );

  const handleSave = async () => {
    try {
      setSaving(true);

      await fetch(
        'http://127.0.0.1:8000/cid/api/',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            cod_cid: codCid,
            descricao,
            sintomas,
            tipo,
            status_ativo: statusAtivo,
          }),
        }
      );

      navigation.navigate('Cids');
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Novo CID
      </Text>

      <Text style={styles.label}>
        Código CID
      </Text>

      <TextInput
        value={codCid}
        onChangeText={setCodCid}
        style={styles.input}
      />

      <Text style={styles.label}>
        Descrição
      </Text>

      <TextInput
        value={descricao}
        onChangeText={setDescricao}
        style={styles.input}
      />

      <Text style={styles.label}>
        Sintomas
      </Text>

      <TextInput
        value={sintomas}
        onChangeText={setSintomas}
        style={[
          styles.input,
          { height: 100 },
        ]}
        multiline
      />

      <Text style={styles.label}>
        Tipo
      </Text>

      <TextInput
        value={tipo}
        onChangeText={setTipo}
        style={styles.input}
      />

      <Text style={styles.label}>
        Ativo
      </Text>

      <Switch
        value={statusAtivo}
        onValueChange={setStatusAtivo}
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
          navigation.navigate('Cids')
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

export default CreateCidScreen;