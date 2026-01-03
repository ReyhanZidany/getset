# GetSet - Smart Closet Organizer 👕

A Progressive Web App (PWA) for organizing your daily outfits with AI-powered weather-based suggestions.

![Homepage](https://github.com/user-attachments/assets/49b2bd2c-aade-429d-8dd4-70641ef544ca)

## ✨ Features

### 🏠 Dashboard
- Real-time weather display for your location
- Weather-based outfit suggestions
- Quick stats overview (wardrobe items, weekly outfits)
- Quick action buttons for common tasks

![Dashboard](https://github.com/user-attachments/assets/e5f0448c-cba0-4e77-8eb0-fee4901f60b4)

### 👔 Virtual Wardrobe
- Add clothing items with image upload (drag & drop supported)
- Categorize items: tops, bottoms, dresses, outerwear, shoes, accessories
- Tag items with colors and seasons
- Advanced filtering and search
- Edit and delete items
- View detailed item information

![Wardrobe](https://github.com/user-attachments/assets/fee0011a-8bdc-4a4a-b3ad-d9708aaac900)

### 📅 Outfit Calendar
- Interactive calendar view
- Plan daily outfits by selecting items from your wardrobe
- Add outfit photos
- Add notes for each outfit
- Visual indicators for logged outfits

![Calendar](https://github.com/user-attachments/assets/1b7ba730-c503-4245-bfe8-0c19d2767ff7)

### ✈️ Travel Planner
- Create trips with destination and dates
- Weather forecast for your destination (up to 7 days)
- Plan outfits for each day of your trip
- Packing tips and suggestions
- Trip type categorization (business, vacation, weekend)

![Travel](https://github.com/user-attachments/assets/90078d6a-d7fa-478d-bed3-1190362dd6d2)

### 📊 Statistics Dashboard
- Most and least worn items
- Favorite colors analysis
- Category distribution
- Monthly outfit trends
- Personalized style insights

![Statistics](https://github.com/user-attachments/assets/54be0045-c5cb-4c76-bd41-6dfd2257e33b)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ReyhanZidany/getset.git
cd getset
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file for environment variables (optional for weather features):
```bash
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key
```

> **Note:** Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Custom component library
- **Icons:** Lucide React
- **Calendar:** React Calendar
- **Date Handling:** date-fns
- **PWA:** next-pwa
- **Storage:** Browser LocalStorage
- **Weather API:** OpenWeatherMap

## 📱 Progressive Web App

GetSet is a fully functional PWA that can be installed on your device:

1. Visit the app in your browser
2. Look for the "Install" prompt
3. Click "Install" to add it to your home screen
4. Use it like a native app!

### PWA Features
- ✅ Offline-ready
- ✅ Installable on desktop and mobile
- ✅ Fast loading with caching
- ✅ Responsive design

## 🎨 Design System

### Color Palette
- **Primary:** Indigo (#6366f1)
- **Secondary:** Slate gray
- **Success:** Green
- **Warning:** Yellow
- **Error:** Red

### Components
All UI components are custom-built and reusable:
- Buttons (primary, secondary, outline, danger)
- Cards with headers and content areas
- Modals for forms and details
- Input fields, selects, and textareas
- Badges for labels
- Loading states (spinner and skeleton)
- Toast notifications
- Image upload with preview

## 💾 Data Storage

All data is stored locally in your browser using LocalStorage:
- Wardrobe items
- Outfit history
- Travel plans
- No server required
- Your data never leaves your device

## 🌤️ Weather Integration

The app uses OpenWeatherMap API to provide:
- Current weather conditions
- Temperature and feels-like temperature
- Humidity and wind speed
- 7-day weather forecast for travel planning

### Smart Outfit Suggestions

Recommendations based on:

**Temperature:**
- < 10°C: Heavy jacket, long pants, boots
- 10-20°C: Light jacket, jeans, sneakers
- 20-28°C: T-shirt, shorts/skirt, sandals
- \> 28°C: Light clothing, sun protection

**Weather Conditions:**
- Rain: Waterproof jacket, umbrella
- Snow: Winter coat, boots
- Sunny: Sunglasses, hat
- Windy: Windbreaker

## 📂 Project Structure

```
getset/
├── app/                      # Next.js app directory
│   ├── dashboard/           # Dashboard page
│   ├── wardrobe/            # Wardrobe management
│   ├── calendar/            # Outfit calendar
│   ├── travel/              # Travel planner
│   ├── stats/               # Statistics dashboard
│   ├── layout.tsx           # Root layout with navigation
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── features/           # Feature-specific components
│   ├── layout/             # Layout components (nav, header)
│   └── ui/                 # Reusable UI components
├── lib/                     # Utilities and logic
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── public/                  # Static assets
│   ├── manifest.json       # PWA manifest
│   └── images/             # App icons
└── package.json            # Dependencies
```

## 🔒 Security

- ✅ No vulnerabilities found (CodeQL scan passed)
- ✅ All data stored locally (no external database)
- ✅ API keys use environment variables
- ✅ TypeScript for type safety
- ✅ Input validation on forms

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Lucide](https://lucide.dev/)
- Built with [Next.js](https://nextjs.org/)

---

Made with ❤️ for fashion-conscious developers
