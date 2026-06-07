import { DrawerScreenProps } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
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
  'CreateResultadoExame'
>;

const CreateResultadoExameScreen = ({
  navigation,
}: Props) => {
  const [dataResultado, setDataResultado] =
    useState('');

  const [conclusoes, setConclusoes] =
    useState('');

  const [valor, setValor] =
    useState('');

  const [unidadeMedida, setUnidadeMedida] =
    useState('');

  const [exameSolicitado, setExameSolicitado] =
    useState<number>();

  const [exames, setExames] =
    useState<any[]>([]);

  const [saving, setSaving] =
    useState(false);

  const fetchExames = async () => {
    const response = await fetch(
      'http://127.0.0.1:8000/exameSolicitado/api/'
    );

    const data =
      await response.json();

    setExames(data);

    if (data.length > 0) {
      setExameSolicitado(
        data[0].id
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      setDataResultado('');
      setConclusoes('');
      setValor('');
      setUnidadeMedida('');

      fetchExames();
    }, [])
  );

  const handleSave = async () => {
    try {
      setSaving(true);

      await fetch(
        'http://127.0.0.1:8000/resultadoexame/api/',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            data_resultado:
              dataResultado,
            conclusoes,
            valor:
              parseFloat(valor),
            unidade_medida:
              unidadeMedida,
            exame_solicitado:
              exameSolicitado,
          }),
        }
      );

      navigation.navigate(
        'ResultadosExame'
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
        Novo Resultado de Exame
      </Text>

      <Text style={styles.label}>
        Data do Resultado
      </Text>

      <TextInput
        value={dataResultado}
        onChangeText={
          setDataResultado
        }
        style={styles.input}
        placeholder="2026-06-06"
      />

      <Text style={styles.label}>
        Conclusões
      </Text>

      <TextInput
        value={conclusoes}
        onChangeText={
          setConclusoes
        }
        style={[
          styles.input,
          { height: 100 },
        ]}
        multiline
      />

      <Text style={styles.label}>
        Valor
      </Text>

      <TextInput
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>
        Unidade de Medida
      </Text>

      <TextInput
        value={unidadeMedida}
        onChangeText={
          setUnidadeMedida
        }
        style={styles.input}
      />

      <Text style={styles.label}>
        Exame Solicitado
      </Text>

      <Picker
        selectedValue={
          exameSolicitado
        }
        onValueChange={value =>
          setExameSolicitado(
            value
          )
        }
      >
        {exames.map(exame => (
          <Picker.Item
            key={exame.id}
            label={
              exame.nome_exame
            }
            value={exame.id}
          />
        ))}
      </Picker>

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
            'ResultadosExame'
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

export default CreateResultadoExameScreen;