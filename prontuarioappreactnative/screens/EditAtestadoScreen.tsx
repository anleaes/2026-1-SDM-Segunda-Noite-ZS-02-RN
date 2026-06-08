import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

// 🛠️ Tipagem ajustada para 'any' para evitar sublinhados vermelhos do TypeScript
const EditAtestadoScreen = ({ route, navigation }: any) => {
  const atestado = route.params?.atestado as any;

  const [codigoAutenticacao, setCodigoAutenticacao] = useState("");
  const [dataInicioAfastamento, setDataInicioAfastamento] = useState("");
  const [quantidadeDias, setQuantidadeDias] = useState("");
  const [tipoAtestado, setTipoAtestado] = useState("MEDICO");
  const [consulta, setConsulta] = useState<number>();

  // 🛠️ Array dinâmico para múltiplos CIDs
  const [cidsSelecionados, setCidsSelecionados] = useState<
    (number | undefined)[]
  >([undefined]);

  const [consultas, setConsultas] = useState<any[]>([]);
  const [cids, setCids] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  // 1. Carrega os catálogos para preencher os Pickers
  useEffect(() => {
    fetch("http://127.0.0.1:8000/consulta/api/")
      .then((res) => res.json())
      .then((data) => setConsultas(data))
      .catch((err) => console.log(err));

    fetch("http://127.0.0.1:8000/cid/api/")
      .then((res) => res.json())
      .then((data) => setCids(data))
      .catch((err) => console.log(err));
  }, []);

  // 2. Preenche os dados quando o atestado é recebido por parâmetro
  useEffect(() => {
    if (atestado) {
      setCodigoAutenticacao(atestado.codigo_autenticacao || "");
      setDataInicioAfastamento(atestado.data_inicio_afastamento || "");
      setQuantidadeDias(
        atestado.quantidade_dias ? String(atestado.quantidade_dias) : "",
      );
      setTipoAtestado(atestado.tipo_atestado || "MEDICO");

      // Ajusta caso a consulta venha como objeto ou apenas o ID numérico
      setConsulta(
        atestado.consulta && typeof atestado.consulta === "object"
          ? atestado.consulta.id
          : atestado.consulta,
      );

      // 🛠️ Carrega os CIDs múltiplos vinculados a este atestado
      if (Array.isArray(atestado.cid) && atestado.cid.length > 0) {
        // Mapeia garantindo que vamos pegar o ID mesmo se o backend enviar o objeto inteiro
        const loadedCids = atestado.cid.map((c: any) =>
          typeof c === "object" ? c.id : c,
        );
        setCidsSelecionados(loadedCids);
      } else {
        setCidsSelecionados([undefined]);
      }
    }
  }, [atestado]);

  // 🛠️ Funções para gerenciar os Pickers dinâmicos
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

      // Filtra para enviar apenas IDs válidos (ignora "Selecione um CID...")
      const cidsFinais = cidsSelecionados.filter((id) => id !== undefined);

      await fetch(`http://127.0.0.1:8000/atestado/api/${atestado.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigo_autenticacao: codigoAutenticacao,
          data_inicio_afastamento: dataInicioAfastamento,
          quantidade_dias: parseInt(quantidadeDias) || 0,
          tipo_atestado: tipoAtestado,
          consulta: consulta,
          // 🎯 Enviando a chave no singular 'cid' conforme o Django espera
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
        <Picker.Item label="Selecione a consulta..." value={undefined} />
        {consultas.map((item) => (
          <Picker.Item
            key={item.id}
            label={`Consulta ${item.id}`}
            value={item.id}
          />
        ))}
      </Picker>

      <Text style={styles.label}>CIDs (Diagnósticos)</Text>

      {/* 🛠️ Lista dinâmica carregando os CIDs do backend */}
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

export default EditAtestadoScreen;
