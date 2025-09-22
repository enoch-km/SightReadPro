# SightReadPro 🎵

**Master sight-reading with fun, daily exercises!**

SightReadPro is a comprehensive music learning platform that helps musicians improve their sight-reading skills through personalized exercises, progress tracking, and gamification.

## ✨ Features

### 🎼 **Core Learning**
- **6 Exercise Types**: Basic Notes, Rhythm Patterns, Scale Recognition, Chord Progressions, Sight Reading, Interval Training
- **Difficulty Levels**: Beginner, Intermediate, Advanced
- **Real-time Feedback**: Instant validation and guidance
- **Timer & Progress**: Track your improvement over time

### 🎵 **Real Audio Features** ⭐ NEW!
- **Web Audio API**: Real-time piano sound generation
- **Interactive Playback**: Play exercises with authentic piano sounds
- **Audio Visualizer**: Real-time frequency visualization
- **Note Recognition**: Practice identifying notes by sound
- **Chord & Melody Playback**: Hear complex musical structures

### 🎼 **Professional Notation** ⭐ NEW!
- **VexFlow Integration**: High-quality music notation rendering
- **Multiple Exercise Types**: Single notes, chords, scales, melodies
- **Visual Staff Notation**: Professional-looking musical staff
- **Interactive Note Selection**: Click to hear notes before answering
- **Advanced Difficulty Progression**: Adaptive exercises based on skill level

### 📄 **Score Upload & Analysis**
- **Upload PDFs/Images**: Drop your own sheet music
- **AI-Powered Analysis**: Key signature, time signature, tempo detection
- **Custom Exercises**: Generate personalized practice based on your music
- **Smart Difficulty**: Automatically adjusts to your uploaded score

### 🏆 **Gamification**
- **XP System**: Earn points for completing exercises
- **Achievement Badges**: Unlock rewards for milestones
- **Daily Streaks**: Build consistent practice habits
- **Progress Tracking**: Visual stats and analytics

### 🎯 **User Experience**
- **Beautiful UI**: Modern gradient design with smooth animations
- **Responsive**: Works on desktop, tablet, and mobile
- **Drag & Drop**: Easy file uploads
- **Intuitive Navigation**: Clean, user-friendly interface

## 🚀 Quick Start

### Choose Your Version:

#### 1. **Basic Web App** (`web-app.html`)
- Core functionality with simulated audio
- File upload and score analysis
- Progress tracking and achievements
- Perfect for getting started

#### 2. **Audio-Enhanced App** (`web-app-audio.html`) ⭐ NEW!
- Real Web Audio API integration
- Piano sound generation and playback
- Audio visualizer
- Interactive note selection
- Real-time audio feedback

#### 3. **VexFlow Notation App** (`web-app-vexflow.html`) ⭐ NEW!
- Professional music notation rendering
- Multiple difficulty levels
- Advanced exercise types (chords, scales, melodies)
- Enhanced visual feedback
- Comprehensive progress tracking

### Getting Started:
1. **Open the app**: Choose your preferred version above
2. **Start Practicing**: Click "Start Practicing" to begin
3. **Upload Your Score**: Use "Upload Your Score" for custom exercises
4. **Track Progress**: Check your stats and achievements

## 🛠️ Technical Stack

### Frontend
- **HTML5/CSS3/JavaScript**: Core web technologies
- **VexFlow**: Professional music notation rendering
- **Web Audio API**: Real-time audio synthesis and playback
- **Canvas API**: Audio visualization and graphics
- **CSS Grid/Flexbox**: Responsive layout system

### Audio System
- **Web Audio API**: Real-time audio synthesis
- **Oscillator Nodes**: Piano sound generation
- **Gain Nodes**: Audio volume control
- **Analyser Nodes**: Frequency visualization
- **Audio Context**: Audio processing pipeline

### File Handling
- **HTML5 File API**: File upload and processing
- **Drag & Drop**: Intuitive file selection
- **File Type Detection**: PDF and image support
- **Size Validation**: File size checking

### Deployment
- **Netlify**: Static site hosting with redirects
- **Vercel**: Alternative deployment platform
- **GitHub Pages**: Free hosting option
- **CDN**: Global content delivery

## 📁 Project Structure

```
SightReadPro/
├── web-app.html              # Basic web version
├── web-app-audio.html        # Audio-enhanced version
├── web-app-vexflow.html      # VexFlow notation version
├── index.html                # Main application file
├── netlify.toml              # Netlify deployment config
├── package.json              # Dependencies and scripts
├── src/                      # React Native source code
│   ├── components/           # Reusable UI components
│   ├── screens/             # Main app screens
│   ├── contexts/            # React contexts
│   └── config/              # Configuration files
├── backend/                  # Backend API (planned)
└── README.md                # This file
```

## 🎵 How It Works

### **Standard Exercises**
1. Choose an exercise type from the practice screen
2. Generate a music staff with notes
3. Play audio to hear the exercise
4. Check your answer for instant feedback
5. Earn XP and track your progress

### **Custom Score Analysis**
1. Upload a PDF or image of sheet music
2. AI analyzes key signature, tempo, difficulty
3. Generate personalized exercises matching your score
4. Practice with exercises that match your music's characteristics

## 🚀 Deployment

### **Netlify (Recommended)**
1. Push code to GitHub repository
2. Connect to Netlify
3. Deploy automatically with the included `netlify.toml`

### **Vercel**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow prompts to deploy

### **GitHub Pages**
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch

## 🔮 Future Enhancements

### ✅ Completed
- **Real Audio Playback**: Web Audio API integration with piano sounds
- **VexFlow Integration**: Professional music notation rendering
- **Multiple App Versions**: Basic, Audio, and VexFlow editions
- **GitHub Repository**: Full version control and deployment setup

### 🚧 In Progress
- **Backend API**: User accounts and data persistence
- **Database Integration**: MongoDB/PostgreSQL for user data
- **File Processing**: Advanced score analysis and processing

### 📋 Planned
- **Advanced Analysis**: Machine learning for score analysis
- **Social Features**: Leaderboards, sharing, and community
- **Mobile App**: React Native version for iOS/Android
- **Offline Mode**: Practice without internet connection
- **Custom Exercise Creator**: User-generated content tools
- **AI-Powered Feedback**: Intelligent practice recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🎼 Support

For questions or support, please open an issue on GitHub.

---

**Happy practicing! 🎵✨**