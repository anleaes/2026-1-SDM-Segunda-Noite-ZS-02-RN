import { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
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

type Props = DrawerScreenProps<DrawerParamList, "EditAtestado">;

const EditAtestadoScreen = ({ route, navigation }: Props) => {
  const { atestado } = route.params;

  const [codigoAutenticacao, setCodigoAutenticacao] = useState(
    atestado.codigo_autenticacao,
  );
  const [dataInicioAfastamento, setDataInicioAfastamento] = useState(
    atestado.data_inicio_afastamento,
  );
  const [quantidadeDias, setQuantidadeDias] = useState(
    atestado.quantidade_dias.toString(),
  );
  const [tipoAtestado, setTipoAtestado] = useState(atestado.tipo_atestado);
  const [consulta, setConsulta] = useState(atestado.consulta);

  // INICIALIZA o estado com os IDs de CIDs que já vieram do DRF
  const [selectedCids, setSelectedCids] = useState<number[]>(
    atestado.cid || [],
  );

  const [consultas, setConsultas] = useState<any[]>([]);
  const [cids, setCids] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConsultas();
    fetchCids();
  }, []);

  const fetchConsultas = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/consulta/api/");
      const data = await response.json();
      setConsultas(data);
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
    if (selectedCids.length === 0) {
      Alert.alert("Atenção", "Selecione pelo menos um CID.");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(
        `http://127.0.0.1:8000/atestado/api/${atestado.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            codigo_autenticacao: codigoAutenticacao,
            data_inicio_afastamento: dataInicioAfastamento,
            quantidade_dias: parseInt(quantidadeDias),
            tipo_atestado: tipoAtestado,
            consulta: consulta,
            cid: selectedCids, // Passa a lista atualizada
          }),
        },
      );

      if (!response.ok) {
        const erro = await response.json();
        Alert.alert("Erro ao atualizar", JSON.stringify(erro));
        return;
      }

      navigation.navigate("Atestados");
    } catch (error) {
      console.log(error);
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
      <Text style={styles.title}>Editar Atestado</Text>

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
        style={styles.input}
        placeholder="YYYY-MM-DD"
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
            label={`Consulta ${item.id}`}
            value={item.id}
          />
        ))}
      </Picker>

      <Text style={styles.label}>CIDs Vinculados (Toque para alterar)</Text>
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
            title="Salvar Alterações"
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

export default EditAtestadoScreen;
