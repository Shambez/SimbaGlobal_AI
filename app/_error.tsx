import { View, Text, ScrollView } from "react-native";

export default function GlobalError({ error }: { error: Error }) {
  return (
    <ScrollView contentContainerStyle={{flexGrow:1, justifyContent:"center", padding:16}}>
      <View>
        <Text style={{fontSize:20, fontWeight:"600", marginBottom:12}}>Something crashed</Text>
        <Text selectable>{String(error?.stack || error?.message || error)}</Text>
      </View>
    </ScrollView>
  );
}