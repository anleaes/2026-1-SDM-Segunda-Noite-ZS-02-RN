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

type Props = DrawerScreenProps<DrawerParamList, "EditMedicamento">;

const EditMedicamentoScreen = ({ route, navigation }: Props) => {
  const { medicamento } = route.params;

  const [principioAtivo, setPrincipioAtivo] = useState(
    medicamento.principio_ativo,
  );
  const [eControlado, setEControlado] = useState(medicamento.e_controlado);
  const [categoria, setCategoria] = useState(medicamento.categoria);
  const [nomeReferencia, setNomeReferencia] = useState(
    medicamento.nome_referencia,
  );
  const [temGenerico, setTemGenerico] = useState(medicamento.tem_generico);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPrincipioAtivo(medicamento.principio_ativo);
    setEControlado(medicamento.e_controlado);
    setCategoria(medicamento.categoria);
    setNomeReferencia(medicamento.nome_referencia);
    setTemGenerico(medicamento.tem_generico);
  }, [medicamento]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await fetch(`${BASE_URL}/api/medicamentos/${medicamento.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          principio_ativo: principioAtivo,
          e_controlado: eControlado,
          categoria: categoria,
          nome_referencia: nomeReferencia,
          tem_generico: temGenerico,
        }),
      });
      navigation.navigate("Medicamentos");
    } catch (error) {
      console.log(error);
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

export default EditMedicamentoScreen;
