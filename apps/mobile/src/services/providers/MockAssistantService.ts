/**
 * Mock Assistant Service
 * 
 * Provides canned, context-aware responses without any API calls.
 * Designed for cognitive support with warm, reassuring responses.
 * 
 * Can be swapped for OpenAI/Claude integration later.
 */

import { IAssistantService, AssistantContext, AssistantResponse, AssistantMessage } from '../interfaces';

// Response templates
const greetings: Record<string, string[]> = {
  morning: [
    "Good morning! It's wonderful to see you. How are you feeling today?",
    "Good morning! I hope you slept well. What would you like to do today?",
    "Hello! It's a beautiful morning. Is there anything I can help you with?",
  ],
  afternoon: [
    "Good afternoon! How has your day been so far?",
    "Hello! I hope you're having a lovely afternoon. What's on your mind?",
    "Good afternoon! Is there something fun you'd like to do together?",
  ],
  evening: [
    "Good evening! How was your day today?",
    "Hello! It's getting to be evening. Would you like to look at some memories?",
    "Good evening! Is there anything special you'd like to do before bedtime?",
  ],
  night: [
    "Hello! It's nighttime now. Would you like me to help you relax?",
    "Hi there. It's late - can I help you with something?",
    "Good evening. Would you like to hear a calming story?",
  ],
};

const groundingResponses = [
  "You're safe and loved. Take a deep breath. {name}, you're at home, and your family loves you very much.",
  "Everything is okay, {name}. Take a slow, deep breath with me. In... and out. You're doing great.",
  "I'm here with you, {name}. You're safe. Would you like to look at some happy photos of your family?",
  "Let's take a moment together, {name}. You're in a safe place. Your family thinks about you every day.",
  "It's okay to feel however you're feeling right now, {name}. I'm here. Would you like to do a calming activity?",
];

const conversationResponses: { pattern: RegExp; responses: string[] }[] = [
  {
    pattern: /family|daughter|son|grandchild|wife|husband/i,
    responses: [
      "Your family loves you so much! Would you like to see some photos of them?",
      "What a wonderful family you have! They're always thinking of you.",
      "Family is so special. Would you like to send them a message?",
    ],
  },
  {
    pattern: /hungry|food|eat|snack|meal/i,
    responses: [
      "Let me remind someone that you might be hungry. In the meantime, would you like to look at some memories?",
      "Food sounds good! Your caregiver will help with that. What would you like to do while we wait?",
    ],
  },
  {
    pattern: /tired|sleep|rest|nap/i,
    responses: [
      "It's okay to rest when you feel tired. Would you like me to play some calming sounds?",
      "Rest is important. Would you like to do a relaxing breathing exercise first?",
    ],
  },
  {
    pattern: /scared|afraid|worried|anxious|confused/i,
    responses: [
      "It's okay to feel that way. You're safe here. Would you like to take some deep breaths together?",
      "I understand. You're not alone. Let's do something calming together.",
      "Everything is going to be alright. You're safe and loved. How about we look at some happy photos?",
    ],
  },
  {
    pattern: /bored|nothing|something/i,
    responses: [
      "Let's find something fun to do! Would you like to play a game or look at memories?",
      "I have some ideas! We could play Memory Match, look at family photos, or just chat.",
    ],
  },
  {
    pattern: /music|song|sing/i,
    responses: [
      "Music is wonderful! Would you like to play Musical Memory Lane?",
      "What kind of music do you enjoy? Maybe we can listen to some favorites.",
    ],
  },
  {
    pattern: /who are you|what are you|help me/i,
    responses: [
      "I'm your friendly companion here to help you! I can show you family photos, play games, or just chat.",
      "I'm here to keep you company and help however I can. What would you like to do?",
    ],
  },
  {
    pattern: /thank|thanks/i,
    responses: [
      "You're very welcome! I'm always happy to help.",
      "It's my pleasure! Is there anything else you'd like to do?",
    ],
  },
  {
    pattern: /love you|like you/i,
    responses: [
      "That's so kind of you to say! I'm here for you anytime.",
      "You're wonderful! I'm always happy to spend time with you.",
    ],
  },
];

const fallbackResponses = [
  "That's interesting! Tell me more about that.",
  "I'm listening. What else is on your mind?",
  "Thank you for sharing that with me. Is there something I can help you with?",
  "I appreciate you talking with me. Would you like to look at some family photos?",
];

const suggestions: Record<string, string[]> = {
  morning: [
    "How did you sleep?",
    "Show me my family",
    "Let's play a game",
    "What day is it?",
  ],
  afternoon: [
    "Show me some memories",
    "Call my family",
    "Let's play a game",
    "I want to relax",
  ],
  evening: [
    "Show me family photos",
    "I had a good day",
    "Play some music",
    "I'm getting tired",
  ],
  night: [
    "Help me relax",
    "Tell me a story",
    "I can't sleep",
    "Good night",
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function replacePlaceholders(text: string, context: AssistantContext): string {
  return text.replace(/{name}/g, context.patientName);
}

class MockAssistantService implements IAssistantService {
  async chat(
    message: string,
    context: AssistantContext,
    _history?: AssistantMessage[]
  ): Promise<AssistantResponse> {
    const messageLower = message.toLowerCase().trim();
    
    // Check for greetings
    if (/^(hi|hello|hey|good\s*(morning|afternoon|evening))[\s!.]*$/i.test(messageLower)) {
      return {
        message: pickRandom(greetings[context.timeOfDay]),
        suggestions: suggestions[context.timeOfDay],
      };
    }

    // Check for pattern matches
    for (const { pattern, responses } of conversationResponses) {
      if (pattern.test(messageLower)) {
        return {
          message: replacePlaceholders(pickRandom(responses), context),
          suggestions: suggestions[context.timeOfDay],
        };
      }
    }

    // Fallback response
    return {
      message: pickRandom(fallbackResponses),
      suggestions: suggestions[context.timeOfDay],
    };
  }

  async getGroundingResponse(context: AssistantContext): Promise<AssistantResponse> {
    return {
      message: replacePlaceholders(pickRandom(groundingResponses), context),
      suggestions: ["I feel better", "Show me family photos", "Let's breathe together"],
    };
  }

  async getSuggestions(context: AssistantContext): Promise<string[]> {
    return suggestions[context.timeOfDay] || suggestions.afternoon;
  }
}

// Singleton instance
export const mockAssistantService = new MockAssistantService();
export default mockAssistantService;
