import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const _layout = () => {
  return (
    <Stack
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: 'white' },
      animation: 'slide_from_right',
      animationDuration: 300,
    }}
    />
  )
}

export default _layout