import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import { DrawerParamList } from '../navigation/DrawerNavigator';

type Props = DrawerScreenProps<
  DrawerParamList,
  'EditAtestado'
>;

const EditAtestadoScreen = ({
  route,
  navigation,
}: Props) => {
  const { atestado } = route.params;

  const [
    codigoAutenticacao,
    setCodigoAutenticacao,
  ] = useState(
    atestado.codigo_autenticacao
  );

  const [
    dataInicioAfastamento,
    setDataInicioAfastamento,
  ] = useState(
    atestado.data_inicio_afastamento
  );

  const [
    quantidadeDias,
    setQuantidadeDias,
  ] = useState(
    atestado.quantidade_dias.toString()
  );

  const [
    tipoAtestado,
    setTipoAtestado,
  ] = useState(
    atestado.tipo_atestado
  );

  const [consulta, setConsulta] =
    useState(atestado.consulta);

  const [cid, setCid] =
    useState(atestado.cid);

  const [consultas, setConsultas] =
    useState<any[]>([]);

  const [cids, setCids] =
    useState<any[]>([]);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    fetchConsultas();
    fetchCids();
  }, []);

  const fetchConsultas = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/consulta/api/'
      );

      const data =
        await response.json();

      setConsultas(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCids = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/cid/api/'
      );

      const data =
        await response.json();

      setCids(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response =
        await fetch(
          `http://127.0.0.1:8000/atestado/api/${atestado.id}/`,
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              codigo_autenticacao:
                codigoAutenticacao,
              data_inicio_afastamento:
                dataInicioAfastamento,
              quantidade_dias:
                parseInt(
                  quantidadeDias
                ),
              tipo_atestado:
                tipoAtestado,
              consulta,
              cid,
            }),
          }
        );

      if (!response.ok) {
        const erro =
          await response.text();

        console.log(erro);
        return;
      }

      navigation.navigate(
        'Atestados'
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
        Editar Atestado
      </Text>

      <Text style={styles.label}>
        Código de Autenticação
      </Text>

      <TextInput
        value={codigoAutenticacao}
        onChangeText={
          setCodigoAutenticacao
        }
        style={styles.input}
      />

      <Text style={styles.label}>
        Data Início Afastamento
      </Text>

      <TextInput
        value={dataInicioAfastamento}
        onChangeText={
          setDataInicioAfastamento
        }
        style={styles.input}
        placeholder="AAAA-MM-DD"
      />

      <Text style={styles.label}>
        Quantidade de Dias
      </Text>

      <TextInput
        value={quantidadeDias}
        onChangeText={
          setQuantidadeDias
        }
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>
        Tipo de Atestado
      </Text>

      <Picker
        selectedValue={tipoAtestado}
        onValueChange={value =>
          setTipoAtestado(value)
        }
      >
        <Picker.Item
          label="Médico"
          value="MEDICO"
        />
        <Picker.Item
          label="Odontológico"
          value="ODONTO"
        />
        <Picker.Item
          label="Outro"
          value="OUTRO"
        />
      </Picker>

      <Text style={styles.label}>
        Consulta
      </Text>

      <Picker
        selectedValue={consulta}
        onValueChange={value =>
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
        CID
      </Text>

      <Picker
        selectedValue={cid}
        onValueChange={value =>
          setCid(value)
        }
      >
        {cids.map(item => (
          <Picker.Item
            key={item.id}
            label={`${item.codigo} - ${item.descricao}`}
            value={item.id}
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
          title="Salvar Alterações"
          onPress={handleSave}
          color="#4B7BE5"
        />
      )}

      <Button
        title="Voltar"
        onPress={() =>
          navigation.navigate(
            'Atestados'
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

export default EditAtestadoScreen;