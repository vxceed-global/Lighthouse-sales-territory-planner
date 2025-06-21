# 🚀 Sales Route & Territory Optimizer (SRTO)

A modern web application for optimizing sales routes and territory management using Google Maps integration and advanced optimization algorithms.

## 📋 Project Overview

SRTO is a comprehensive solution for sales teams to:
- **Optimize delivery routes** using Google OR-Tools
- **Manage territories** with interactive map boundaries
- **Visualize outlet data** with advanced mapping features
- **Analyze performance** with real-time analytics
- **Plan multi-day routes** with NPPD integration

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Ant Design** for professional UI components
- **Redux Toolkit** for state management
- **Google Maps Platform** for mapping features

### Backend (Planned)
- **Python FastAPI** for high-performance APIs
- **Google OR-Tools** for route optimization
- **Databricks** for NPPD analytics
- **PostgreSQL** for data persistence

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (recommended: v22.16.0)
- Google Maps API key
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/lighthouse-srto.git
cd lighthouse-srto

# Navigate to frontend
cd srto-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Google Maps API key

# Start development server
npm run dev
```

### Environment Setup

Create a `.env` file in the `srto-frontend` directory:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_API_BASE_URL=http://localhost:8000/api
VITE_DEFAULT_MAP_CENTER_LAT=12.9716
VITE_DEFAULT_MAP_CENTER_LNG=77.5946
VITE_DEFAULT_MAP_ZOOM=12
```

## 📁 Project Structure

```
lighthouse-srto/
├── srto-frontend/          # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API and external services
│   │   ├── store/         # Redux store and slices
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript type definitions
│   │   └── styles/        # Global styles and themes
│   ├── public/            # Static assets
│   └── package.json       # Dependencies and scripts
├── docs/                  # Project documentation
│   ├── frontend-design/   # Frontend architecture docs
│   └── api/              # API documentation (planned)
└── README.md             # This file
```

## ✨ Features

### ✅ Implemented (Phase 1)
- **Professional UI/UX** with Ant Design
- **Google Maps Integration** with custom markers and controls
- **Interactive Map Features**:
  - Multiple map styles (default, satellite, terrain)
  - Outlet markers with info windows
  - Route visualization with polylines
  - Map controls (zoom, location, style switching)
- **Responsive Layout** with collapsible sidebar
- **Type-Safe Development** with comprehensive TypeScript types
- **Modern Development Stack** with Vite and hot reload

### 🚧 In Development (Phase 2)
- **Outlet Management** - CRUD operations for outlets
- **Route Optimization** - Integration with optimization algorithms
- **Territory Management** - Boundary drawing and assignment
- **Real-time Data** - API integration and live updates

### 📋 Planned (Phase 3+)
- **Advanced Analytics** - Performance dashboards
- **Multi-day Planning** - Complex route scheduling
- **NPPD Integration** - Predictive analytics
- **Data Export** - Reports and data export functionality

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Development Workflow

1. **Feature Development**: Create feature branches from `main`
2. **Code Quality**: Use ESLint and Prettier for consistent code style
3. **Type Safety**: Leverage TypeScript for robust development
4. **Testing**: Write tests for new features (testing setup planned)

## 🗺️ Roadmap

### Phase 1: Foundation ✅ (Completed)
- [x] Project setup and configuration
- [x] Google Maps integration
- [x] Basic UI layout and navigation
- [x] Type definitions and architecture

### Phase 2: Core Features 🚧 (In Progress)
- [ ] Outlet management interface
- [ ] Route optimization UI
- [ ] Territory boundary tools
- [ ] API integration layer

### Phase 3: Advanced Features 📋 (Planned)
- [ ] Real-time optimization
- [ ] Advanced analytics
- [ ] Multi-day planning
- [ ] Performance optimizations

### Phase 4: Production Ready 🎯 (Future)
- [ ] Comprehensive testing
- [ ] Documentation
- [ ] Deployment automation
- [ ] Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Maps Platform** for mapping services
- **Ant Design** for UI components
- **React Team** for the amazing framework
- **Vite Team** for the fast build tool

---

**Built with ❤️ for optimizing sales operations**
