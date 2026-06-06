import { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { BASE_URL } from "../config";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "EditReceita">;

const EditReceitaScreen = ({ route, navigation }: Props) => {
  const { receita } = route.params;

  const [dataEmissao, setDataEmissao] = useState(receita.data_emissao);
  const [validade, setValidade] = useState(receita.validade);
  const [instrucoes, setInstrucoes] = useState(receita.instrucoes);
  const [eDigital, setEDigital] = useState(receita.e_digital);
  const [consultaId, setConsultaId] = useState(String(receita.consulta));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDataEmissao(receita.data_emissao);
    setValidade(receita.validade);
    setInstrucoes(receita.instrucoes);
    setEDigital(receita.e_digital);
    setConsultaId(String(receita.consulta));
  }, [receita]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await fetch(`${BASE_URL}/api/receitas/${receita.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data_emissao: dataEmissao,
          validade: validade,
          instrucoes: instrucoes,
          e_digital: eDigital,
          consulta: parseInt(consultaId),
        }),
      });
      navigation.navigate("Receitas");
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Data de Emissão</Text>
      <TextInput
        value={dataEmissao}
        onChangeText={setDataEmissao}
        style={styles.input}
      />

      <Text style={styles.label}>Validade</Text>
      <TextInput
        value={validade}
        onChangeText={setValidade}
        style={styles.input}
      />

      <Text style={styles.label}>ID da Consulta Vinculada</Text>
      <TextInput
        value={consultaId}
        onChangeText={setConsultaId}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Instruções</Text>
      <TextInput
        value={instrucoes}
        onChangeText={setInstrucoes}
        style={[styles.input, { height: 100 }]}
        multiline
      />

      <Text style={styles.label}>Ativo</Text>
      <Switch
        value={eDigital}
        onValueChange={setEDigital}
        style={{ alignSelf: "flex-start" }}
      />

      <View style={{ marginTop: 20, paddingBottom: 40 }}>
        {saving ? (
          <ActivityIndicator
            size="large"
            color="#4B7BE5"
            style={{ marginVertical: 10 }}
          />
        ) : (
          <TouchableOpacity style={styles.fullSaveButton} onPress={handleSave}>
            <Text style={styles.fullButtonText}>SALVAR</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.fullBackButton}
          onPress={() => navigation.navigate("Receitas")}
        >
          <Text style={styles.fullButtonText}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  label: { fontWeight: "600", marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 },
  fullSaveButton: {
    backgroundColor: "#4B7BE5",
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 2,
  },
  fullBackButton: {
    backgroundColor: "#2196F3",
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  fullButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});

export default EditReceitaScreen;
