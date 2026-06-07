import { Picker } from "@react-native-picker/picker";
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

import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "EditReceita">;

interface ReceitaMedicamento {
  id?: number;
  receita?: number;
  medicamento: number | undefined;
  frequencia: string;
  duracao_dias: string;
  dose: string;
  concentracao: string;
}

const EditReceitaScreen = ({ route, navigation }: Props) => {
  const receita = route.params?.receita as any;
  const API_LOCAL = "http://localhost:8000";

  const [consultaId, setConsultaId] = useState<number | undefined>(undefined);
  const [dataEmissao, setDataEmissao] = useState("");
  const [validade, setValidade] = useState("");
  const [instrucoes, setInstrucoes] = useState("");
  const [eDigital, setEDigital] = useState(true);

  const [detalhesMedicamentos, setDetalhesMedicamentos] = useState<
    ReceitaMedicamento[]
  >([]);
  const [listaConsultas, setListaConsultas] = useState<any[]>([]);
  const [listaMedicamentos, setListaMedicamentos] = useState<any[]>([]);
  const [listaPacientes, setListaPacientes] = useState<any[]>([]);
  const [listaMedicos, setListaMedicos] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_LOCAL}/consulta/api/`)
      .then((res) => res.json())
      .then((data) =>
        setListaConsultas(Array.isArray(data) ? data : data.results || []),
      )
      .catch((err) => console.log("Erro consultas:", err));

    fetch(`${API_LOCAL}/medicamento/api/`)
      .then((res) => res.json())
      .then((data) =>
        setListaMedicamentos(Array.isArray(data) ? data : data.results || []),
      )
      .catch((err) => console.log("Erro medicamentos:", err));

    fetch(`${API_LOCAL}/paciente/api/`)
      .then((res) => res.json())
      .then((data) =>
        setListaPacientes(Array.isArray(data) ? data : data.results || []),
      )
      .catch((err) => console.log("Erro pacientes:", err));

    fetch(`${API_LOCAL}/medico/api/`)
      .then((res) => res.json())
      .then((data) =>
        setListaMedicos(Array.isArray(data) ? data : data.results || []),
      )
      .catch((err) => console.log("Erro médicos:", err));
  }, []);

  useEffect(() => {
    if (receita) {
      setConsultaId(
        receita.consulta && typeof receita.consulta === "object"
          ? Number(receita.consulta.id)
          : Number(receita.consulta),
      );
      setDataEmissao(receita.data_emissao || "");
      setValidade(receita.validade || "");
      setInstrucoes(receita.instrucoes || receita.instrucoes_gerais || "");
      setEDigital(receita.e_digital !== undefined ? receita.e_digital : true);

      fetch(`${API_LOCAL}/receitaMedicamento/api/`)
        .then((res) => res.json())
        .then((dadosM2M) => {
          const listaBruta = Array.isArray(dadosM2M)
            ? dadosM2M
            : dadosM2M.results || [];
          const filtradosPorReceita = listaBruta.filter(
            (item: any) => Number(item.receita) === Number(receita.id),
          );

          const formatados = filtradosPorReceita.map((item: any) => ({
            id: item.id,
            receita: item.receita,
            medicamento: item.medicamento
              ? Number(
                  typeof item.medicamento === "object"
                    ? item.medicamento.id
                    : item.medicamento,
                )
              : undefined,
            frequencia: item.frequencia || "",
            duracao_dias: String(item.duracao_dias || ""),
            dose: item.dose || "",
            concentracao: item.concentracao || "",
          }));
          setDetalhesMedicamentos(formatados);
        })
        .catch((err) =>
          console.log("Erro ao carregar itens intermediários:", err),
        );
    }
  }, [receita, listaConsultas, listaMedicamentos]);

  const handleAddItem = () => {
    setDetalhesMedicamentos([
      ...detalhesMedicamentos,
      {
        medicamento: undefined,
        frequencia: "",
        duracao_dias: "",
        dose: "",
        concentracao: "",
      },
    ]);
  };

  const updateItem = (
    index: number,
    field: keyof ReceitaMedicamento,
    value: any,
  ) => {
    const novosItens = [...detalhesMedicamentos];
    novosItens[index] = { ...novosItens[index], [field]: value };
    setDetalhesMedicamentos(novosItens);
  };

  const getDescricaoConsulta = (consulta: any) => {
    const pacId =
      consulta.paciente && typeof consulta.paciente === "object"
        ? consulta.paciente.id
        : consulta.paciente;
    const pacienteObj = listaPacientes.find(
      (p) => Number(p.id) === Number(pacId),
    );
    const nomePaciente = pacienteObj
      ? pacienteObj.nome
      : `Paciente ID ${pacId}`;

    const medId =
      consulta.medico && typeof consulta.medico === "object"
        ? consulta.medico.id
        : consulta.medico;
    const medicoObj = listaMedicos.find((m) => Number(m.id) === Number(medId));
    const nomeMedico = medicoObj ? medicoObj.nome : `Médico ID ${medId}`;

    const dataTexto = consulta.data_emissao || consulta.data_agendada || "";
    const dataFormatada = dataTexto
      ? ` em ${dataTexto.substring(8, 10)}/${dataTexto.substring(5, 7)}/${dataTexto.substring(0, 4)}`
      : "";

    return `Consulta de ${nomePaciente} com Dr(a). ${nomeMedico}${dataFormatada}`;
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const medicamentosFinaisIds = detalhesMedicamentos
        .map((item) => item.medicamento)
        .filter((id) => id !== undefined) as number[];

      const responseReceita = await fetch(
        `${API_LOCAL}/receita/api/${receita.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            consulta: consultaId,
            data_emissao: dataEmissao,
            validade: validade,
            instrucoes: instrucoes,
            e_digital: eDigital,
            medicamentos: medicamentosFinaisIds,
          }),
        },
      );

      if (!responseReceita.ok) {
        const err = await responseReceita.json();
        alert("Erro ao salvar receita pai: " + JSON.stringify(err));
        return;
      }

      for (const item of detalhesMedicamentos) {
        if (!item.medicamento) continue;

        const payloadItem = {
          receita: receita.id,
          medicamento: item.medicamento,
          frequencia: item.frequencia,
          duracao_dias: parseInt(item.duracao_dias, 10) || 0,
          dose: item.dose,
          concentracao: item.concentracao,
        };

        if (item.id) {
          await fetch(`${API_LOCAL}/receitaMedicamento/api/${item.id}/`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadItem),
          });
        } else {
          await fetch(`${API_LOCAL}/receitaMedicamento/api/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadItem),
          });
        }
      }

      navigation.navigate("Receitas" as any);
    } catch (error) {
      console.log(error);
      alert("Erro de conexão.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Dados Gerais da Receita</Text>

      <Text style={styles.label}>Consulta</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={consultaId}
          onValueChange={(val) => setConsultaId(val ? Number(val) : undefined)}
          style={styles.pickerWebNative}
        >
          <Picker.Item label="Selecione a consulta..." value={undefined} />
          {listaConsultas.map((c) => (
            <Picker.Item
              key={c.id}
              label={getDescricaoConsulta(c)}
              value={c.id}
            />
          ))}
        </Picker>
      </View>

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

      <Text style={styles.label}>Instruções Gerais</Text>
      <TextInput
        value={instrucoes}
        onChangeText={setInstrucoes}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <View style={styles.switchRow}>
        <Text style={styles.label}>É Digital?</Text>
        <Switch value={eDigital} onValueChange={setEDigital} />
      </View>

      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
        Medicamentos Prescritos
      </Text>

      {detalhesMedicamentos.map((item, index) => (
        <View key={index} style={styles.itemBlock}>
          <Text style={styles.label}>Medicamento</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={item.medicamento}
              onValueChange={(val) =>
                updateItem(index, "medicamento", val ? Number(val) : undefined)
              }
              style={styles.pickerWebNative}
            >
              <Picker.Item
                label="Selecione um medicamento..."
                value={undefined}
              />
              {listaMedicamentos.map((m) => (
                <Picker.Item
                  key={m.id}
                  label={
                    m.principio_ativo || m.nome_referencia || `ID: ${m.id}`
                  }
                  value={m.id}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Frequência</Text>
          <TextInput
            value={item.frequencia}
            onChangeText={(t) => updateItem(index, "frequencia", t)}
            style={styles.input}
          />

          <Text style={styles.label}>Duração em Dias</Text>
          <TextInput
            value={item.duracao_dias}
            onChangeText={(t) => updateItem(index, "duracao_dias", t)}
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>Dose</Text>
          <TextInput
            value={item.dose}
            onChangeText={(t) => updateItem(index, "dose", t)}
            style={styles.input}
          />

          <Text style={styles.label}>Concentração</Text>
          <TextInput
            value={item.concentracao}
            onChangeText={(t) => updateItem(index, "concentracao", t)}
            style={styles.input}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.addButtonText}>+ Adicionar Medicamento</Text>
      </TouchableOpacity>

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
          onPress={() => navigation.navigate("Receitas" as any)}
        >
          <Text style={styles.fullButtonText}>VOLTAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 4,
  },
  label: { fontWeight: "600", marginTop: 10, marginBottom: 4, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    color: "#000",
    backgroundColor: "#fff",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  pickerWebNative: {
    height: 45,
    width: "100%",
    color: "#000",
    borderStyle: "none",
    backgroundColor: "transparent",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  itemBlock: {
    padding: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 15,
  },
  addButton: {
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  addButtonText: { fontWeight: "bold", color: "#4B7BE5" },
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
