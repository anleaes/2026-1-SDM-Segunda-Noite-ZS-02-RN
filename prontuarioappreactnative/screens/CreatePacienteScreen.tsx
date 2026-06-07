import React from "react";
import { Text, View, Button } from "react-native";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<DrawerParamList, "CreatePaciente">;

const CreatePacienteScreen = ({ navigation }: Props) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    }}
  >
    <Text style={{ fontSize: 18, marginBottom: 10 }}>
      Tela de Criar Paciente (Temporária)
    </Text>
    <Button title="Voltar" onPress={() => navigation.navigate("Pacientes")} />
  </View>
);

export default CreatePacienteScreen;
