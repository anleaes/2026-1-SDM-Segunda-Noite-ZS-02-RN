import { Ionicons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';

import CidScreen, { Cid } from '../screens/CidScreen';
import CreateCidScreen from '../screens/CreateCidScreen';
import EditCidScreen from '../screens/EditCidScreen';
import HomeScreen from '../screens/HomeScreen';

import CustomDrawerContent from '../components/CustomDrawerContent';
import CreatePacienteScreen from '../screens/CreatePacienteScreen';
import EditPacienteScreen from '../screens/EditPacienteScreen';
import PacienteScreen, { Paciente } from '../screens/PacienteScreen';

export type DrawerParamList = {
  Home: undefined;

  Cids: undefined;
  CreateCid: undefined;
  EditCid: { cid: Cid };

  Pacientes: undefined;
  CreatePaciente: undefined;
  EditPaciente: { paciente: Paciente };
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#4B7BE5',
        drawerLabelStyle: {
          marginLeft: 0,
          fontSize: 16,
        },
        drawerStyle: {
          backgroundColor: '#fff',
          width: 250,
        },
        headerStyle: {
          backgroundColor: '#4B7BE5',
        },
        headerTintColor: '#fff',
      }}
    >
      {/* HOME */}
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
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
          title: 'CID',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="medical-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="CreateCid"
        component={CreateCidScreen}
        options={{
          title: 'Novo CID',
          drawerItemStyle: { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="EditCid"
        component={EditCidScreen}
        options={{
          title: 'Editar CID',
          drawerItemStyle: { display: 'none' },
        }}
      />

      {/* PACIENTES */}
      <Drawer.Screen
        name="Pacientes"
        component={PacienteScreen}
        options={{
          title: 'Pacientes',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="CreatePaciente"
        component={CreatePacienteScreen}
        options={{
          title: 'Novo Paciente',
          drawerItemStyle: { display: 'none' },
        }}
      />

      <Drawer.Screen
        name="EditPaciente"
        component={EditPacienteScreen}
        options={{
          title: 'Editar Paciente',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
