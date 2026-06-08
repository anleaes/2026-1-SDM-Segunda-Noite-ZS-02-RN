import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { DrawerParamList } from "../navigation/DrawerNavigator";

import { Picker } from "@react-native-picker/picker";

type Props = DrawerScreenProps<DrawerParamList, "CreateAtestado">;

const CreateAtestadoScreen = ({ navigation }: Props) => {
  const [codigoAutenticacao, setCodigoAutenticacao] = useState("");

  const [dataInicioAfastamento, setDataInicioAfastamento] = useState("");

  const [quantidadeDias, setQuantidadeDias] = useState("");

  const [tipoAtestado, setTipoAtestado] = useState("MEDICO");

  const [consulta, setConsulta] = useState<number>();

  // Array dinâmico para múltiplos CIDs
  const [cidsSelecionados, setCidsSelecionados] = useState<
    (number | undefined)[]
  >([undefined]);

  const [consultas, setConsultas] = useState<any[]>([]);

  const [cids, setCids] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setCodigoAutenticacao("");
      setDataInicioAfastamento("");
      setQuantidadeDias("");
      setTipoAtestado("MEDICO");
      setCidsSelecionados([undefined]); // Reseta com um campo vazio inicial

      fetchConsultas();
      fetchCids();
    }, []),
  );

  const fetchConsultas = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/consulta/api/");

      const data = await response.json();

      setConsultas(data);

      if (data.length > 0) {
        setConsulta(data[0].id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCids = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/cid/api/");

      const data = await response.json();

      setCids(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Funções para gerenciar os Pickers de CID dinamicamente
  const handleAddCid = () => {
    setCidsSelecionados([...cidsSelecionados, undefined]);
  };

  const updateCidValue = (index: number, value: number | undefined) => {
    const novosCids = [...cidsSelecionados];
    novosCids[index] = value;
    setCidsSelecionados(novosCids);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Filtra apenas os IDs válidos escolhidos
      const cidsFinais = cidsSelecionados.filter((id) => id !== undefined);

      await fetch("http://127.0.0.1:8000/atestado/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo_autenticacao: codigoAutenticacao,
          data_inicio_afastamento: dataInicioAfastamento,
          quantidade_dias: parseInt(quantidadeDias), // Digite um número válido aqui na tela!
          tipo_atestado: tipoAtestado,
          consulta: consulta,
          // 🎯 AQUI ESTÁ A CORREÇÃO: Enviando a chave 'cid' no singular conforme o teu models.py
          cid: cidsFinais,
        }),
      });

      navigation.navigate("Atestados");
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Atestado</Text>

      <Text style={styles.label}>Código de Autenticação</Text>

      <TextInput
        value={codigoAutenticacao}
        onChangeText={setCodigoAutenticacao}
        style={styles.input}
      />

      <Text style={styles.label}>Data Início Afastamento</Text>

      <TextInput
        value={dataInicioAfastamento}
        onChangeText={setDataInicioAfastamento}
        placeholder="AAAA-MM-DD"
        style={styles.input}
      />

      <Text style={styles.label}>Quantidade de Dias</Text>

      <TextInput
        value={quantidadeDias}
        onChangeText={setQuantidadeDias}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Tipo de Atestado</Text>

      <Picker
        selectedValue={tipoAtestado}
        onValueChange={(value) => setTipoAtestado(value)}
      >
        <Picker.Item label="Médico" value="MEDICO" />
        <Picker.Item label="Odontológico" value="ODONTO" />
        <Picker.Item label="Outro" value="OUTRO" />
      </Picker>

      <Text style={styles.label}>Consulta</Text>

      <Picker
        selectedValue={consulta}
        onValueChange={(value) => setConsulta(value)}
      >
        {consultas.map((item) => (
          <Picker.Item
            key={item.id}
            label={`Consulta ${item.id}`}
            value={item.id}
          />
        ))}
      </Picker>

      <Text style={styles.label}>CIDs (Diagnósticos)</Text>

      {/* Múltiplos Pickers gerados dinamicamente mantendo o estilo */}
      {cidsSelecionados.map((cidSelecionado, index) => (
        <View
          key={index}
          style={{
            marginBottom: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
          }}
        >
          <Picker
            selectedValue={cidSelecionado}
            onValueChange={(value) =>
              updateCidValue(index, value ? Number(value) : undefined)
            }
          >
            <Picker.Item label="Selecione um CID..." value={undefined} />
            {cids.map((item) => (
              <Picker.Item
                key={item.id}
                label={`${item.cod_cid} - ${item.descricao}`}
                value={item.id}
              />
            ))}
          </Picker>
        </View>
      ))}

      {/* Botão idêntico à estrutura nativa para não quebrar o layout */}
      <View style={{ marginBottom: 20 }}>
        <Button title="+ Adicionar CID" onPress={handleAddCid} color="#888" />
      </View>

      {saving ? (
        <ActivityIndicator size="large" color="#4B7BE5" />
      ) : (
        <View style={{ marginBottom: 10 }}>
          <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
        </View>
      )}

      <Button title="Voltar" onPress={() => navigation.navigate("Atestados")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    alignSelf: "center",
  },
  label: {
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
});

export default CreateAtestadoScreen;
