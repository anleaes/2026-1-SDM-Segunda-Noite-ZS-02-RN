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
  View,
} from "react-native";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "CreatePaciente">;

const CreatePacienteScreen = ({ navigation }: Props) => {
  // Específico de paciente
  const [dataNascimento, setDataNascimento] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [endereco, setEndereco] = useState("");
  const [saving, setSaving] = useState(false);

  // Herdado de pessoa
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  useFocusEffect(
    useCallback(() => {
      setDataNascimento("");
      setPeso("");
      setAltura("");
      setEndereco("");
      setNome("");
      setSobrenome("");
      setCpf("");
      setTelefone("");
      setEmail("");
    }, []),
  );

  const handleSave = async () => {
    setSaving(true);

    try {
      // Ajustando o peso e altura para usar ponto ao invés de vírgula (caso o usuário digite "70,5") ajuste
      const pesoFormatado = peso.replace(",", ".");
      const alturaFormatada = altura.replace(",", ".");

      const res = await fetch("http://127.0.0.1:8000/paciente/api/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // O lado esquerdo é como o Django espera (snake_case).
          // O lado direito é o seu estado do React (camelCase).
          nome: nome,
          sobrenome: sobrenome,
          cpf: cpf,
          telefone: telefone,
          email: email,
          data_nascimento: dataNascimento, // <- Correção vital aqui!
          peso: parseFloat(pesoFormatado), // O Django espera um número (Float)
          altura: parseFloat(alturaFormatada), // O Django espera um número (Float)
          endereco: endereco,
        }),
      });

      // Se o Django recusar (ex: faltou campo, CPF duplicado, data em formato errado)
      if (!res.ok) {
        const errorData = await res.json();
        Alert.alert("Erro ao salvar", JSON.stringify(errorData));
        setSaving(false);
        return; // Interrompe a função para NÃO navegar de tela
      }

      // Só navega para a lista se realmente deu certo!
      navigation.navigate("Pacientes");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    } finally {
      setSaving(false);
    }
  };

  return (
    // Trocado de <View> para <ScrollView> para permitir rolagem no celular
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.title}>Novo paciente</Text>

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
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        value={telefone}
        onChangeText={setTelefone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Data de nascimento</Text>
      <TextInput
        value={dataNascimento}
        onChangeText={setDataNascimento}
        style={styles.input}
        placeholder="YYYY-MM-DD" // Dica do formato esperado pelo Django
      />

      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput
        value={peso}
        onChangeText={setPeso}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Ex: 70.5"
      />

      <Text style={styles.label}>Altura (m)</Text>
      <TextInput
        value={altura}
        onChangeText={setAltura}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Ex: 1.75"
      />

      <Text style={styles.label}>Endereço</Text>
      <TextInput
        value={endereco}
        onChangeText={setEndereco}
        style={styles.input}
      />

      <View style={{ marginTop: 20 }}>
        {saving ? (
          <ActivityIndicator size="large" color="#4B7BE5" />
        ) : (
          <Button title="Salvar" onPress={handleSave} color="#4B7BE5" />
        )}
      </View>

      <View style={{ marginTop: 10 }}>
        <Button
          title="Voltar"
          onPress={() => navigation.navigate("Pacientes")}
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
});

export default CreatePacienteScreen;
