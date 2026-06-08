import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "CreateMedicamento">;

const CreateMedicamentoScreen = ({ navigation }: Props) => {
  const [principioAtivo, setPrincipioAtivo] = useState("");
  const [eControlado, setEControlado] = useState(false);
  const [categoria, setCategoria] = useState("");
  const [nomeReferencia, setNomeReferencia] = useState("");
  const [temGenerico, setTemGenerico] = useState(false);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setPrincipioAtivo("");
      setEControlado(false);
      setCategoria("");
      setNomeReferencia("");
      setTemGenerico(false);
    }, []),
  );

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`http://127.0.0.1:8000/medicamento/api/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          principio_ativo: principioAtivo,
          e_controlado: eControlado,
          categoria: categoria,
          nome_referencia: nomeReferencia,
          tem_generico: temGenerico,
        }),
      });

      // Validação para exibir erros do Django na tela
      if (!response.ok) {
        const errJson = await response.json();
        Alert.alert("Erro ao criar", JSON.stringify(errJson));
        return;
      }

      navigation.navigate("Medicamentos");
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Falha de conexão com o servidor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Princípio Ativo</Text>
      <TextInput
        value={principioAtivo}
        onChangeText={setPrincipioAtivo}
        style={styles.input}
      />

      <Text style={styles.label}>Nome de Referência</Text>
      <TextInput
        value={nomeReferencia}
        onChangeText={setNomeReferencia}
        style={styles.input}
      />

      <Text style={styles.label}>Categoria</Text>
      <TextInput
        value={categoria}
        onChangeText={setCategoria}
        style={styles.input}
      />

      <Text style={styles.label}>Controlado</Text>
      <Switch
        value={eControlado}
        onValueChange={setEControlado}
        style={{ alignSelf: "flex-start" }}
      />

      <Text style={styles.label}>Genérico</Text>
      <Switch
        value={temGenerico}
        onValueChange={setTemGenerico}
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
          onPress={() => navigation.navigate("Medicamentos")}
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

export default CreateMedicamentoScreen;
