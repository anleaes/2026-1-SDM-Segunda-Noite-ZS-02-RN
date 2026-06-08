import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "CreateAtestado">;

const CreateAtestadoScreen = ({ navigation }: Props) => {
  const [codigoAutenticacao, setCodigoAutenticacao] = useState("");
  const [dataInicioAfastamento, setDataInicioAfastamento] = useState("");
  const [quantidadeDias, setQuantidadeDias] = useState("");
  const [tipoAtestado, setTipoAtestado] = useState("MEDICO");
  const [consulta, setConsulta] = useState<number>();
  const [selectedCids, setSelectedCids] = useState<number[]>([]);

  const [consultas, setConsultas] = useState<any[]>([]);
  const [cids, setCids] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setCodigoAutenticacao("");
      setDataInicioAfastamento("");
      setQuantidadeDias("");
      setTipoAtestado("MEDICO");
      setSelectedCids([]);

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
      console.log("Erro ao buscar consultas:", error);
    }
  };

  const fetchCids = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/cid/api/");
      const data = await response.json();
      setCids(data);
    } catch (error) {
      console.log("Erro ao buscar CIDs:", error);
    }
  };

  const toggleCid = (id: number) => {
    setSelectedCids((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((cidId) => cidId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSave = async () => {
    // 1. Validações Locais Fortes antes de ir para o servidor
    if (!codigoAutenticacao || !dataInicioAfastamento || !quantidadeDias) {
      Alert.alert("Atenção", "Preencha todos os campos de texto.");
      return;
    }
    if (!consulta) {
      Alert.alert("Atenção", "Selecione uma consulta.");
      return;
    }
    if (selectedCids.length === 0) {
      Alert.alert("Atenção", "Selecione pelo menos um CID.");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("http://127.0.0.1:8000/atestado/api/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigo_autenticacao: codigoAutenticacao,
          data_inicio_afastamento: dataInicioAfastamento,
          quantidade_dias: parseInt(quantidadeDias),
          tipo_atestado: tipoAtestado,
          consulta: consulta,
          cid: selectedCids,
        }),
      });

      if (!response.ok) {
        // 2. Se o Django reclamar, mostramos EXATAMENTE o que ele disse
        const erro = await response.json();
        console.log("Erro do Backend:", erro); // Verifica no terminal do Expo
        Alert.alert("Erro de Validação (Django)", JSON.stringify(erro));
        setSaving(false);
        return;
      }

      // 3. Se deu certo, navega
      navigation.navigate("Atestados");
    } catch (error) {
      console.log("Erro de Rede:", error);
      Alert.alert("Erro", "Falha na conexão com o servidor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
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
        placeholder="YYYY-MM-DD"
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
      <Picker selectedValue={tipoAtestado} onValueChange={setTipoAtestado}>
        <Picker.Item label="Médico" value="MEDICO" />
        <Picker.Item label="Odontológico" value="ODONTO" />
        <Picker.Item label="Outro" value="OUTRO" />
      </Picker>

      <Text style={styles.label}>Consulta</Text>
      <Picker selectedValue={consulta} onValueChange={setConsulta}>
        {consultas.map((item) => (
          <Picker.Item
            key={item.id}
            // Agora usamos o campo novo da API, com fallback caso demore a atualizar
            label={item.descricao_completa || `Consulta ${item.id}`}
            value={item.id}
          />
        ))}
      </Picker>

      <Text style={styles.label}>CIDs Múltiplos (Toque para selecionar)</Text>
      <View style={styles.multiSelectContainer}>
        {cids.map((item) => {
          const isSelected = selectedCids.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.multiSelectBadge,
                isSelected
                  ? styles.multiSelectBadgeActive
                  : styles.multiSelectBadgeInactive,
              ]}
              onPress={() => toggleCid(item.id)}
            >
              <Text
                style={
                  isSelected
                    ? styles.multiSelectTextActive
                    : styles.multiSelectTextInactive
                }
              >
                {item.cod_cid} - {item.descricao}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ marginTop: 20 }}>
        {saving ? (
          <ActivityIndicator size="large" color="#4B7BE5" />
        ) : (
          <Button
            title="Salvar Atestado"
            onPress={handleSave}
            color="#4B7BE5"
          />
        )}
      </View>
      <View style={{ marginTop: 10 }}>
        <Button
          title="Voltar"
          onPress={() => navigation.navigate("Atestados")}
          color="#888"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    alignSelf: "center",
  },
  label: { fontWeight: "600", marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10 },
  multiSelectContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  multiSelectBadge: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 8,
  },
  multiSelectBadgeInactive: { backgroundColor: "#f0f0f0", borderColor: "#ccc" },
  multiSelectBadgeActive: {
    backgroundColor: "#4B7BE5",
    borderColor: "#4B7BE5",
  },
  multiSelectTextInactive: { color: "#333" },
  multiSelectTextActive: { color: "#fff", fontWeight: "bold" },
});

export default CreateAtestadoScreen;
