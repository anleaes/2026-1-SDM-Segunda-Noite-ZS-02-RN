import { DrawerScreenProps } from "@react-navigation/drawer";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
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
import { DrawerParamList } from "../navigation/DrawerNavigator";

// Atenção: rota com navigations/drawerNavigator.tsx lá precisa estar declarado o create médico
type Props = DrawerScreenProps<DrawerParamList, "CreateMedico">;

const CreateMedicoScreen = ({ navigation }: Props) => {
  // --- Atributos herdados de Pessoa ---
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  // --- Atributos específicos de Medico ---
  const [crm, setCrm] = useState("");
  const [especialidade, setEspecialidade] = useState("Clinico Geral");
  const [matricula, setMatricula] = useState("");
  const [dataContratacao, setDataContratacao] = useState("");
  const [cargo, setCargo] = useState("");
  const [estaAtivo, setEstaAtivo] = useState(true);

  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setNome("");
      setSobrenome("");
      setCpf("");
      setTelefone("");
      setEmail("");
      setCrm("");
      setEspecialidade("Clinico Geral");
      setMatricula("");
      setDataContratacao("");
      setCargo("");
      setEstaAtivo(true);
    }, []),
  );

  const handleSave = async () => {
    setSaving(true);

    // 1. Tradutor de Data: de DD/MM/AAAA para YYYY-MM-DD
    let dataFormatadaParaDjango = dataContratacao;
    if (dataContratacao.includes("/")) {
      const partes = dataContratacao.split("/");
      if (partes.length === 3) {
        dataFormatadaParaDjango = `${partes[2]}-${partes[1]}-${partes[0]}`;
      }
    }

    const res = await fetch("http://127.0.0.1:8000/medico/api/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: nome,
        sobrenome: sobrenome,
        cpf: cpf,
        telefone: telefone,
        email: email,
        crm: crm,
        especialidade: especialidade,
        matricula: matricula,
        data_contratacao: dataFormatadaParaDjango, // <- Manda a data traduzida
        cargo: cargo,
        esta_ativo: estaAtivo,
      }),
    });

    // 2. Trava de Segurança: Só muda de tela se o Django aprovar
    if (res.ok) {
      navigation.navigate("Medicos");
    } else {
      const erro = await res.text();
      alert(`Erro ao salvar! O Django recusou os dados:\n\n${erro}`);
    }

    setSaving(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Novo Médico</Text>

      {/* --- DADOS DE PESSOA --- */}
      <Text style={styles.label}>Nome</Text>
      <TextInput value={nome} onChangeText={setNome} style={styles.input} />

      <Text style={styles.label}>Sobrenome</Text>
      <TextInput
        value={sobrenome}
        onChangeText={setSobrenome}
        style={styles.input}
      />

      <Text style={styles.label}>CPF (Único)</Text>
      <TextInput
        value={cpf}
        onChangeText={setCpf}
        style={styles.input}
        keyboardType="numeric"
        maxLength={11}
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        value={telefone}
        onChangeText={setTelefone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>E-mail (Único)</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* --- DADOS DE MÉDICO --- */}
      <Text style={styles.label}>CRM (Único)</Text>
      <TextInput value={crm} onChangeText={setCrm} style={styles.input} />

      <Text style={styles.label}>Especialidade</Text>
      <TextInput
        value={especialidade}
        onChangeText={setEspecialidade}
        style={styles.input}
      />

      <Text style={styles.label}>Matrícula (Única)</Text>
      <TextInput
        value={matricula}
        onChangeText={setMatricula}
        style={styles.input}
      />

      <Text style={styles.label}>Data de Contratação</Text>
      <TextInput
        value={dataContratacao}
        onChangeText={setDataContratacao}
        style={styles.input}
        placeholder="DD/MM/AAAA"
        placeholderTextColor="#999"
        maxLength={10}
        keyboardType="numbers-and-punctuation"
      />

      <Text style={styles.label}>Cargo</Text>
      <TextInput value={cargo} onChangeText={setCargo} style={styles.input} />

      {/* --- CAMPO BOOLEANO (SWITCH) --- */}
      <View style={styles.switchContainer}>
        <Text style={styles.labelSwitch}>Médico está ativo?</Text>
        <Switch
          value={estaAtivo}
          onValueChange={setEstaAtivo}
          trackColor={{ false: "#ccc", true: "#4B7BE5" }}
          thumbColor={estaAtivo ? "#fff" : "#f4f3f4"}
        />
      </View>

      {/* --- BOTÕES --- */}
      <View style={{ marginTop: 20 }}>
        {saving ? (
          <ActivityIndicator size="large" color="#4B7BE5" />
        ) : (
          <Button title="Salvar Médico" onPress={handleSave} color="#4B7BE5" />
        )}
      </View>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Voltar"
          onPress={() => navigation.goBack()}
          color="#888"
        />
      </View>
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
    backgroundColor: "#f9f9f9",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  labelSwitch: {
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CreateMedicoScreen;
