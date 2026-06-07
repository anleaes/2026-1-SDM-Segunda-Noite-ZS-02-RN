import { Ionicons } from "@expo/vector-icons";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import React from "react";

import CidScreen, { Cid } from "../screens/CidScreen";
import CreateCidScreen from "../screens/CreateCidScreen";
import CreatePacienteScreen from "../screens/CreatePacienteScreen";
import EditCidScreen from "../screens/EditCidScreen";
import EditPacienteScreen from "../screens/EditPacienteScreen";
import HomeScreen from "../screens/HomeScreen";
import PacienteScreen, { Paciente } from "../screens/PacienteScreen";

// IMPORTS DA TUA PARTE (MÉDICO)
import CreateMedicoScreen from "../screens/CreateMedicoScreen";
import EditMedicoScreen from "../screens/EditMedicoScreen";
import MedicoScreen, { Medico } from "../screens/MedicoScreen";

// IMPORTS DA PARTE DOS COLEGAS (ARGEL E EXAMES)
import ConsultasScreen from "../screens/ConsultasScreen";
import CreateConsultaScreen from "../screens/CreateConsultaScreen";
import CreateExameSolicitadoScreen from "../screens/CreateExameSolicitadoScreen";
import CreateMedicamentoScreen from "../screens/CreateMedicamentoScreen";
import CreateReceitaScreen from "../screens/CreateReceitaScreen";
import CreateResultadoExameScreen from "../screens/CreateResultadoExameScreen";
import EditConsultaScreen from "../screens/EditConsultaScreen";
import EditExameSolicitadoScreen from "../screens/EditExameSolicitadoScreen";
import EditMedicamentoScreen from "../screens/EditMedicamentoScreen";
import EditReceitaScreen from "../screens/EditReceitaScreen";
import EditResultadoExameScreen from "../screens/EditResultadoExameScreen";
import ExameSolicitadoScreen, {
  ExameSolicitado,
} from "../screens/ExameSolicitadoScreen";
import MedicamentosScreen from "../screens/MedicamentosScreen";
import ReceitasScreen from "../screens/ReceitasScreen";
import ResultadoExameScreen, {
  ResultadoExame,
} from "../screens/ResultadoExameScreen";

import AnamneseScreen, { Anamnese } from "../screens/AnamneseScreen";
import CreateAnamneseScreen from "../screens/CreateAnamneseScreen";
import EditAnamneseScreen from "../screens/EditAnamneseScreen";

// TIPAGENS TÉCNICAS DA TUA PARTE (DIAGRAMA DE CLASSES)
export type Consulta = {
  id: number;
  data_agendada: string;
  status: string;
  motivo: string;
  nivel_prioridade: string;
  paciente: number;
  medico: number;
};

export type Medicamento = {
  id: number;
  principio_ativo: string;
  e_controlado: boolean;
  categoria: string;
  nome_referencia: string;
  tem_generico: boolean;
};

export type Receita = {
  id: number;
  data_emissao: string;
  validade: string;
  instrucoes: string;
  e_digital: boolean;
  consulta: number;
};

// LISTA DE PARÂMETROS DE TODAS AS ROTAS DO PROJETO
export type DrawerParamList = {
  Home: undefined;

  Cids: undefined;
  CreateCid: undefined;
  EditCid: { cid: Cid };

  Pacientes: undefined;
  CreatePaciente: undefined;
  EditPaciente: { paciente: Paciente };

  Medicos: undefined;
  CreateMedico: undefined;
  EditMedico: { medico: Medico };

  Consultas: undefined;
  CreateConsulta: undefined;
  EditConsulta: { consulta: Consulta };

  Medicamentos: undefined;
  CreateMedicamento: undefined;
  EditMedicamento: { medicamento: Medicamento };

  Receitas: undefined;
  CreateReceita: undefined;
  EditReceita: { receita: Receita };

  ExamesSolicitados: undefined;
  CreateExameSolicitado: undefined;
  EditExameSolicitado: { exame: ExameSolicitado };

  ResultadosExame: undefined;
  CreateResultadoExame: undefined;
  EditResultadoExame: { resultado: ResultadoExame };

  Anamnese: undefined;
  CreateAnamnese: undefined;
  EditAnamnese: { anamnese: Anamnese };
};

// 🛠️ APENAS ESTA FUNÇÃO FOI ADICIONADA PARA MATAR O ERRO
const CustomDrawerContentComponent = (props: any) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContentComponent {...props} />}
      screenOptions={{
        drawerActiveTintColor: "#4B7BE5",
        drawerLabelStyle: {
          marginLeft: 0,
          fontSize: 16,
        },
        drawerStyle: {
          backgroundColor: "#fff",
          width: 250,
        },
        headerStyle: {
          backgroundColor: "#4B7BE5",
        },
        headerTintColor: "#fff",
      }}
    >
      {/* HOME */}
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Início",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* CID */}
      <Drawer.Screen
        name="Cids"
        component={CidScreen}
        options={{
          title: "CID",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="medical-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="CreateCid"
        component={CreateCidScreen}
        options={{
          title: "Novo CID",
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name="EditCid"
        component={EditCidScreen}
        options={{
          title: "Editar CID",
          drawerItemStyle: { display: "none" },
        }}
      />

      {/* PACIENTES */}
      <Drawer.Screen
        name="Pacientes"
        component={PacienteScreen}
        options={{
          title: "Pacientes",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="CreatePaciente"
        component={CreatePacienteScreen}
        options={{
          title: "Novo Paciente",
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name="EditPaciente"
        component={EditPacienteScreen}
        options={{
          title: "Editar Paciente",
          drawerItemStyle: { display: "none" },
        }}
      />

      {/* MÉDICOS */}
      <Drawer.Screen
        name="Medicos"
        component={MedicoScreen}
        options={{
          title: "Médicos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="CreateMedico"
        component={CreateMedicoScreen}
        options={{
          title: "Novo Médico",
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name="EditMedico"
        component={EditMedicoScreen}
        options={{
          title: "Editar Médico",
          drawerItemStyle: { display: "none" },
        }}
      />

      {/* ANAMNESES */}
      <Drawer.Screen
        name="Anamnese"
        component={AnamneseScreen}
        options={{
          title: "Anamneses",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="medical" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CreateAnamnese"
        component={CreateAnamneseScreen}
        options={{
          title: "Nova Anamnese",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="EditAnamnese"
        component={EditAnamneseScreen}
        options={{
          title: "Editar Anamnese",
          drawerItemStyle: { display: "none" },
        }}
      />

      {/* 📅 CONSULTAS (ARGEL) */}
      <Drawer.Screen
        name="Consultas"
        component={ConsultasScreen}
        options={{
          title: "Consultas",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="CreateConsulta"
        component={CreateConsultaScreen}
        options={{
          title: "Nova Consulta",
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name="EditConsulta"
        component={EditConsultaScreen}
        options={{
          title: "Editar Consulta",
          drawerItemStyle: { display: "none" },
        }}
      />

      {/* 💊 MEDICAMENTOS (ARGEL) */}
      <Drawer.Screen
        name="Medicamentos"
        component={MedicamentosScreen}
        options={{
          title: "Medicamentos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="flask-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="CreateMedicamento"
        component={CreateMedicamentoScreen}
        options={{
          title: "Novo Medicamento",
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name="EditMedicamento"
        component={EditMedicamentoScreen}
        options={{
          title: "Editar Medicamento",
          drawerItemStyle: { display: "none" },
        }}
      />

      {/* 📄 RECEITAS (ARGEL) */}
      <Drawer.Screen
        name="Receitas"
        component={ReceitasScreen}
        options={{
          title: "Receitas",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="CreateReceita"
        component={CreateReceitaScreen}
        options={{
          title: "Nova Receita",
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name="EditReceita"
        component={EditReceitaScreen}
        options={{
          title: "Editar Receita",
          drawerItemStyle: { display: "none" },
        }}
      />

      {/* EXAMES SOLICITADOS */}
      <Drawer.Screen
        name="ExamesSolicitados"
        component={ExameSolicitadoScreen}
        options={{
          title: "Exames Solicitados",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="CreateExameSolicitado"
        component={CreateExameSolicitadoScreen}
        options={{
          title: "Novo Exame",
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name="EditExameSolicitado"
        component={EditExameSolicitadoScreen}
        options={{
          title: "Editar Exame",
          drawerItemStyle: { display: "none" },
        }}
      />

      {/* RESULTADOS DE EXAMES */}
      <Drawer.Screen
        name="ResultadosExame"
        component={ResultadoExameScreen}
        options={{
          title: "Resultados de Exame",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="CreateResultadoExame"
        component={CreateResultadoExameScreen}
        options={{
          title: "Novo Resultado",
          drawerItemStyle: { display: "none" },
        }}
      />

      <Drawer.Screen
        name="EditResultadoExame"
        component={EditResultadoExameScreen}
        options={{
          title: "Editar Resultado",
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
