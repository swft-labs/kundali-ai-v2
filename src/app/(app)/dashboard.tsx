import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowRight } from "lucide-react-native";

const dummyInsights = {
  daily_quote: "The stars align in your favor today.",
  transition: "Mercury's movement today enhances communication and self-expression.",
  dos: ["Meditate in the morning", "Wear white for positive energy", "Connect with loved ones"],
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
    <SafeAreaView className="flex-1 bg-gray-100">
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }} className="p-4">
        <Text className="text-2xl font-bold text-center text-gray-900 mb-6">
            🌟 Daily Insights
        </Text>


        {/* Transit Quote */}
        <Pressable className="border border-gray-200 bg-white dark:bg-black p-4 rounded-2xl mb-4">
            <Text className="font-semibold text-lg">🌌 Planetary Influence</Text>
            <Text className="text-gray-700 mt-1">{dummyInsights.transition}</Text>
        </Pressable>

        {/* Dos */}
        <Pressable className="border border-gray-200 bg-white dark:bg-black p-4 rounded-2xl mb-4">
            <Text className="font-semibold text-lg">✅ Dos</Text>
            {dummyInsights.dos.map((item, index) => (
            <Text key={index} className="text-gray-700 mt-1">• {item}</Text>
            ))}
        </Pressable>

        {/* Don'ts */}
        <Pressable className="border border-gray-200 bg-white dark:bg-black p-4 rounded-2xl mb-4">
            <Text className="font-semibold text-lg">❌ Don'ts</Text>
            {dummyInsights.donts.map((item, index) => (
            <Text key={index} className="text-gray-700 mt-1">• {item}</Text>
            ))}
        </Pressable>

        {/* Suggestions */}
        <Pressable className="border border-gray-200 bg-white dark:bg-black p-4 rounded-2xl mb-4">
            <Text className="font-semibold text-lg">💡 Suggestions</Text>
            {dummyInsights.suggestions.map((item, index) => (
            <Text key={index} className="text-gray-700 mt-1">• {item}</Text>
            ))}
        </Pressable>

        {/* Mood of the Day */}
        <Pressable className="border border-gray-200 bg-white dark:bg-black p-4 rounded-2xl mb-4 flex-row justify-between items-center">
            <View>
            <Text className="font-semibold text-lg">🌟 Mood of the Day</Text>
            <Text className="text-gray-700 mt-1">{dummyInsights.mood_of_the_day}</Text>
            </View>
            <ArrowRight size={18} color="#888" />
        </Pressable>

        {/* Auspicious Time */}
        <Pressable className="border border-gray-200 bg-white dark:bg-black p-4 rounded-2xl mb-4 flex-row justify-between items-center">
            <View>
            <Text className="font-semibold text-lg">⏳ Auspicious Time</Text>
            <Text className="text-gray-700 mt-1">{dummyInsights.auspicious_time}</Text>
            </View>
            <ArrowRight size={18} color="#888" />
        </Pressable>

        {/* Daily Quote */}
        <Pressable className="border border-gray-200 bg-white dark:bg-black p-4 rounded-2xl">
            <Text className="font-semibold text-lg">📖 Daily Quote</Text>
            <Text className="text-gray-600 italic text-center mt-2">
            "{dummyInsights.daily_quote}"
            </Text>
        </Pressable>
        </ScrollView>
    </SafeAreaView>
  );
}
