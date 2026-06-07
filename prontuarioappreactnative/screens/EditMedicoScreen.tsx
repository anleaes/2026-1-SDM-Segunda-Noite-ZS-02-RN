import { DrawerScreenProps } from "@react-navigation/drawer";
import React, { useEffect, useState } from "react";
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

type Props = DrawerScreenProps<DrawerParamList, "EditMedico">;

const EditMedicoScreen = ({ route, navigation }: Props) => {
  // Puxa os dados do médico clicado na tela anterior
  const { medico } = route.params;

  // Função para converter a data do Django (YYYY-MM-DD) para a tela do celular (DD/MM/YYYY)
  const formataDataParaTela = (data: string) => {
    if (!data) return "";
    if (data.includes("-")) {
      const partes = data.split("-");
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
    }
    return data;
  };

  // --- Estados de Pessoa ---
  const [nome, setNome] = useState(medico.nome);
  const [sobrenome, setSobrenome] = useState(medico.sobrenome);
  const [cpf, setCpf] = useState(medico.cpf);
  const [telefone, setTelefone] = useState(medico.telefone);
  const [email, setEmail] = useState(medico.email);

  // --- Estados de Médico ---
  const [crm, setCrm] = useState(medico.crm);
  const [especialidade, setEspecialidade] = useState(medico.especialidade);
  const [matricula, setMatricula] = useState(medico.matricula);
  // Usa o conversor para o usuário ver a data certinha com barras
  const [dataContratacao, setDataContratacao] = useState(
    formataDataParaTela(medico.data_contratacao),
  );
  const [cargo, setCargo] = useState(medico.cargo);
  const [estaAtivo, setEstaAtivo] = useState(medico.esta_ativo);

  const [saving, setSaving] = useState(false);

  // Recarrega os dados caso os parâmetros da rota mudem
  useEffect(() => {
    setNome(medico.nome);
    setSobrenome(medico.sobrenome);
    setCpf(medico.cpf);
    setTelefone(medico.telefone);
    setEmail(medico.email);
    setCrm(medico.crm);
    setEspecialidade(medico.especialidade);
    setMatricula(medico.matricula);
    setDataContratacao(formataDataParaTela(medico.data_contratacao));
    setCargo(medico.cargo);
    setEstaAtivo(medico.esta_ativo);
  }, [medico]);

  const handleSave = async () => {
    try {
      setSaving(true);

      // Reverte a data de DD/MM/YYYY de volta para YYYY-MM-DD antes de enviar ao Django
      let dataFormatadaParaDjango = dataContratacao;
      if (dataContratacao.includes("/")) {
        const partes = dataContratacao.split("/");
        if (partes.length === 3) {
          dataFormatadaParaDjango = `${partes[2]}-${partes[1]}-${partes[0]}`;
        }
      }

      await fetch(`http://127.0.0.1:8000/medico/api/${medico.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          sobrenome,
          cpf,
          telefone,
          email,
          crm,
          especialidade,
          matricula,
          data_contratacao: dataFormatadaParaDjango,
          cargo,
          esta_ativo: estaAtivo,
        }),
      });

      // Volta para a listagem
      navigation.navigate("Medicos");
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    // Trocado View por ScrollView para caber todos os campos
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.label}>Nome</Text>
      <TextInput value={nome} onChangeText={setNome} style={styles.input} />

      <Text style={styles.label}>Sobrenome</Text>
      <TextInput
        value={sobrenome}
        onChangeText={setSobrenome}
        style={styles.input}
      />

      <Text style={styles.label}>CPF</Text>
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

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>CRM</Text>
      <TextInput value={crm} onChangeText={setCrm} style={styles.input} />

      <Text style={styles.label}>Especialidade</Text>
      <TextInput
        value={especialidade}
        onChangeText={setEspecialidade}
        style={styles.input}
      />

      <Text style={styles.label}>Matrícula</Text>
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
        maxLength={10}
        keyboardType="numbers-and-punctuation"
      />

      <Text style={styles.label}>Cargo</Text>
      <TextInput value={cargo} onChangeText={setCargo} style={styles.input} />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Médico Ativo</Text>
        <Switch value={estaAtivo} onValueChange={setEstaAtivo} />
      </View>

      <View style={styles.buttonContainer}>
        {saving ? (
          <ActivityIndicator size="large" color="#4B7BE5" />
        ) : (
          <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Voltar"
          onPress={() => navigation.navigate("Medicos")}
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
  label: {
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default EditMedicoScreen;
