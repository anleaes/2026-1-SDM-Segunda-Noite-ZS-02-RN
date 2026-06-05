import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Button,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";

import { BASE_URL } from "../config";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "CreateReceita">;

const CreateReceitaScreen = ({ navigation }: Props) => {
  const [dataEmissao, setDataEmissao] = useState("");
  const [validade, setValidade] = useState("");
  const [instrucoes, setInstrucoes] = useState("");
  const [eDigital, setEDigital] = useState(false);
  const [consultaId, setConsultaId] = useState("");
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setDataEmissao("");
      setValidade("");
      setInstrucoes("");
      setEDigital(false);
      setConsultaId("");
    }, []),
  );

  const handleSave = async () => {
    try {
      setSaving(true);

      await fetch(`${BASE_URL}/api/receitas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      console.log("Erro ao salvar receita:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Nova Receita</Text>

      <Text style={styles.label}>Data de Emissão</Text>
      <TextInput
        value={dataEmissao}
        onChangeText={setDataEmissao}
        style={styles.input}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Validade</Text>
      <TextInput
        value={validade}
        onChangeText={setValidade}
        style={styles.input}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>ID da Consulta Vinculada</Text>
      <TextInput
        value={consultaId}
        onChangeText={setConsultaId}
        keyboardType="numeric"
        style={styles.input}
        placeholder="Digite o ID numérico da consulta"
      />

      <Text style={styles.label}>Instruções de Uso</Text>
      <TextInput
        value={instrucoes}
        onChangeText={setInstrucoes}
        style={[styles.input, { height: 100 }]}
        multiline
        placeholder="Descreva a posologia e orientações gerais"
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>É receita digital?</Text>
        <Switch value={eDigital} onValueChange={setEDigital} />
      </View>

      <View style={styles.buttonGap}>
        {saving ? (
          <ActivityIndicator size="large" color="#4B7BE5" />
        ) : (
          <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
        )}
      </View>

      <Button
        title="Voltar"
        onPress={() => navigation.navigate("Receitas")}
        color="#777"
      />
    </ScrollView>
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
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingRight: 4,
  },
  buttonGap: {
    marginTop: 24,
    marginBottom: 8,
  },
});

export default CreateReceitaScreen;
