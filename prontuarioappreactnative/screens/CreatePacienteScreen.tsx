import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { DrawerParamList } from '../navigation/DrawerNavigator';

type Props = DrawerScreenProps<
  DrawerParamList,
  'CreatePaciente'
>;

const CreatePacienteScreen = ({
  navigation,
}: Props) => {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [endereco, setEndereco] = useState('');

  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setNome('');
      setDataNascimento('');
      setPeso('');
      setAltura('');
      setEndereco('');
    }, [])
  );

  const handleSave = async () => {
    try {
      setSaving(true);

      await fetch('http://127.0.0.1:8000/paciente/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome,
          data_nascimento: dataNascimento,
          peso: parseFloat(peso),
          altura: parseFloat(altura),
          endereco,
        }),
      });

      navigation.navigate('Pacientes');
    } catch (error) {
      console.log('Erro ao criar paciente:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Paciente</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <Text style={styles.label}>Data de nascimento</Text>
      <TextInput
        value={dataNascimento}
        onChangeText={setDataNascimento}
        style={styles.input}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput
        value={peso}
        onChangeText={setPeso}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Altura (m)</Text>
      <TextInput
        value={altura}
        onChangeText={setAltura}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Endereço</Text>
      <TextInput
        value={endereco}
        onChangeText={setEndereco}
        style={styles.input}
      />

      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <Button
          title="Salvar"
          onPress={handleSave}
          color="#4B7BE5"
        />
      )}

      <Button
        title="Voltar"
        onPress={() => navigation.navigate('Pacientes')}
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

export default CreatePacienteScreen;