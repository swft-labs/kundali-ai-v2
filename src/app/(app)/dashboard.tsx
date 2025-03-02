import { ArrowRight } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const dummyInsights = {
  daily_quote: "The stars align in your favor today.",
  transition:
    "Mercury's movement today enhances communication and self-expression.",
  dos: [
    "Meditate in the morning",
    "Wear white for positive energy",
    "Connect with loved ones",
  ],
  donts: ["Avoid arguments", "Postpone major decisions", "Don't overwork"],
  suggestions: [
    "Focus on mindfulness and deep breathing today.",
    "Take a break from technology for clarity.",
    "Make a small but impactful change in your routine.",
  ],
  mood_of_the_day: "Optimistic & Focused",
  auspicious_time: "10:30 AM - 12:00 PM",
};

export default function DashboardPage() {
  // Commented out Zustand code for now
  // const { insights, loading, error, fetchDashboard } = useDashboardStore();
  // useEffect(() => {
  //     fetchDashboard("1234567890");
  // }, []);

  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }} className="p-4">
        <Text className="mb-6 text-center text-2xl font-bold text-gray-900">
          🌟 Daily Insights
        </Text>

        {/* Transit Quote */}
        <Pressable className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 dark:bg-black">
          <Text className="text-lg font-semibold">🌌 Planetary Influence</Text>
          <Text className="mt-1 text-gray-700">{dummyInsights.transition}</Text>
        </Pressable>

        {/* Dos */}
        <Pressable className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 dark:bg-black">
          <Text className="text-lg font-semibold">✅ Dos</Text>
          {dummyInsights.dos.map((item, index) => (
            <Text key={index} className="mt-1 text-gray-700">
              • {item}
            </Text>
          ))}
        </Pressable>

        {/* Don'ts */}
        <Pressable className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 dark:bg-black">
          <Text className="text-lg font-semibold">❌ Don'ts</Text>
          {dummyInsights.donts.map((item, index) => (
            <Text key={index} className="mt-1 text-gray-700">
              • {item}
            </Text>
          ))}
        </Pressable>

        {/* Suggestions */}
        <Pressable className="mb-4 rounded-2xl border border-gray-200 bg-white p-4 dark:bg-black">
          <Text className="text-lg font-semibold">💡 Suggestions</Text>
          {dummyInsights.suggestions.map((item, index) => (
            <Text key={index} className="mt-1 text-gray-700">
              • {item}
            </Text>
          ))}
        </Pressable>

        {/* Mood of the Day */}
        <Pressable className="mb-4 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 dark:bg-black">
          <View>
            <Text className="text-lg font-semibold">🌟 Mood of the Day</Text>
            <Text className="mt-1 text-gray-700">
              {dummyInsights.mood_of_the_day}
            </Text>
          </View>
          <ArrowRight size={18} color="#888" />
        </Pressable>

        {/* Auspicious Time */}
        <Pressable className="mb-4 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 dark:bg-black">
          <View>
            <Text className="text-lg font-semibold">⏳ Auspicious Time</Text>
            <Text className="mt-1 text-gray-700">
              {dummyInsights.auspicious_time}
            </Text>
          </View>
          <ArrowRight size={18} color="#888" />
        </Pressable>

        {/* Daily Quote */}
        <Pressable className="rounded-2xl border border-gray-200 bg-white p-4 dark:bg-black">
          <Text className="text-lg font-semibold">📖 Daily Quote</Text>
          <Text className="mt-2 text-center italic text-gray-600">
            "{dummyInsights.daily_quote}"
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
