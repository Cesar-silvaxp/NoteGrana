import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type ActiveTab =
  | 'dashboard'
  | 'relatorios'
  | 'configuracoes';

interface BottomNavigationProps {
  active: ActiveTab;
  onDashboard: () => void;
  onRelatorios: () => void;
  onConfiguracoes: () => void;
}

function DashboardIcon({
  active,
}: {
  active: boolean;
}) {
  return (
    <View
      style={[
        styles.iconFrame,
        active && styles.iconFrameActive,
      ]}>
      <View style={styles.dashboardGrid}>
        <View style={styles.dashboardSquare} />
        <View style={styles.dashboardSquare} />
        <View style={styles.dashboardSquare} />
        <View style={styles.dashboardSquare} />
      </View>
    </View>
  );
}

function ReportsIcon({
  active,
}: {
  active: boolean;
}) {
  return (
    <View
      style={[
        styles.iconFrame,
        active && styles.iconFrameActive,
      ]}>
      <View style={styles.reportBars}>
        <View
          style={[
            styles.reportBar,
            styles.reportBarSmall,
          ]}
        />

        <View
          style={[
            styles.reportBar,
            styles.reportBarMedium,
          ]}
        />

        <View
          style={[
            styles.reportBar,
            styles.reportBarLarge,
          ]}
        />
      </View>
    </View>
  );
}

function SettingsIcon({
  active,
}: {
  active: boolean;
}) {
  return (
    <View
      style={[
        styles.iconFrame,
        active && styles.iconFrameActive,
      ]}>
      <View style={styles.gearContainer}>
        <View
          style={[
            styles.gearTooth,
            styles.gearToothTop,
          ]}
        />

        <View
          style={[
            styles.gearTooth,
            styles.gearToothBottom,
          ]}
        />

        <View
          style={[
            styles.gearTooth,
            styles.gearToothLeft,
          ]}
        />

        <View
          style={[
            styles.gearTooth,
            styles.gearToothRight,
          ]}
        />

        <View style={styles.gearRing}>
          <View style={styles.gearCenter} />
        </View>
      </View>
    </View>
  );
}

function BottomNavigation({
  active,
  onDashboard,
  onRelatorios,
  onConfiguracoes,
}: BottomNavigationProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={({pressed}) => [
          styles.navigationItem,
          pressed && styles.pressed,
        ]}
        onPress={onDashboard}>
        <DashboardIcon
          active={active === 'dashboard'}
        />

        <Text
          style={[
            styles.navigationText,
            active === 'dashboard' &&
              styles.navigationTextActive,
          ]}>
          Dashboard
        </Text>
      </Pressable>

      <Pressable
        style={({pressed}) => [
          styles.navigationItem,
          pressed && styles.pressed,
        ]}
        onPress={onRelatorios}>
        <ReportsIcon
          active={active === 'relatorios'}
        />

        <Text
          style={[
            styles.navigationText,
            active === 'relatorios' &&
              styles.navigationTextActive,
          ]}>
          Relatórios
        </Text>
      </Pressable>

      <Pressable
        style={({pressed}) => [
          styles.navigationItem,
          pressed && styles.pressed,
        ]}
        onPress={onConfiguracoes}>
        <SettingsIcon
          active={active === 'configuracoes'}
        />

        <Text
          style={[
            styles.navigationText,
            active === 'configuracoes' &&
              styles.navigationTextActive,
          ]}>
          Configurações
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 82,
    backgroundColor: '#BDEBB9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 5,
  },

  navigationItem: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pressed: {
    opacity: 0.6,
  },

  iconFrame: {
    width: 32,
    height: 32,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },

  iconFrameActive: {
    borderColor: '#222222',
  },

  navigationText: {
    color: '#222222',
    fontSize: 9,
  },

  navigationTextActive: {
    color: '#3F6B3A',
    fontWeight: 'bold',
  },

  dashboardGrid: {
    width: 20,
    height: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },

  dashboardSquare: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: '#3F6B3A',
  },

  reportBars: {
    width: 21,
    height: 21,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  reportBar: {
    width: 5,
    backgroundColor: '#3F6B3A',
    borderRadius: 2,
  },

  reportBarSmall: {
    height: 8,
  },

  reportBarMedium: {
    height: 14,
  },

  reportBarLarge: {
    height: 20,
  },

  gearContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  gearRing: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 4,
    borderColor: '#3F6B3A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  gearCenter: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3F6B3A',
  },

  gearTooth: {
    position: 'absolute',
    width: 6,
    height: 5,
    borderRadius: 1,
    backgroundColor: '#3F6B3A',
  },

  gearToothTop: {
    top: 0,
  },

  gearToothBottom: {
    bottom: 0,
  },

  gearToothLeft: {
    left: -1,
    transform: [{rotate: '90deg'}],
  },

  gearToothRight: {
    right: -1,
    transform: [{rotate: '90deg'}],
  },
});

export default BottomNavigation;