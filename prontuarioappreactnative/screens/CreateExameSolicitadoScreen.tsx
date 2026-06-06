import React from "react";
import { Text, View, Button } from "react-native";
import { DrawerScreenProps } from "@react-navigation/drawer";
import { DrawerParamList } from "../navigation/DrawerNavigator";

type Props = DrawerScreenProps<
  DrawerParamList,
  "CreateExameSolicitado"
>;

const CreateExameSolicitadoScreen = ({
  navigation,
}: Props) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    }}
  >
    <Text
      style={{
        fontSize: 18,
        marginBottom: 10,
      }}
    >
      Tela de Criar Exame Solicitado
      (Temporária)
    </Text>

    <Button
      title="Voltar"
      onPress={() =>
        navigation.navigate(
          "ExamesSolicitados"
        )
      }
    />
  </View>
);

export default CreateExameSolicitadoScreen;