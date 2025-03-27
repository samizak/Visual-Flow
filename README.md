# Visual Flow - Interactive JSON Visualization Tool

Visual Flow is a powerful web application that transforms complex JSON data into intuitive, interactive visualizations. It helps developers understand, analyze, and share JSON structures with ease.

---

![Visual Flow Preview](public/visual-flow-preview.png)

---

## 🌐 Live Demo

Visit the live application at [visualflowapp.vercel.app](https://visualflowapp.vercel.app)

---

## ✨ Features

- **Interactive Visualizations**: Transform JSON into intuitive, interactive flowcharts.
- **Real-time Parsing**: Instant validation and error detection as you type.
- **Schema Detection**: Automatically identify and highlight data structures.
- **Node Highlighting**: Easily identify relationships between data elements.
- **Search Functionality**: Quickly find specific values or keys in complex structures.
- **Export Options**: Save visualizations as images for documentation or presentations.
- **Sharing Capabilities**: Share your visualizations with team members.
- **Dark Mode**: Optimized for comfortable viewing in any environment.

---

## 🚀 Getting Started

This is a [Next.js](https://nextjs.org) project. To run it locally:

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation Steps

1.  **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/json-visualiser.git
    ```

2.  **Navigate to the project directory**

    ```bash
    cd json-visualiser
    ```

3.  **Install dependencies**

    ```bash
    npm install
    ```

4.  **Run the development server**

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

---

## 🛠️ Technologies Used

- **Frontend**:
  - [Next.js 15](https://nextjs.org)
  - [React 19](https://reactjs.org)
  - [TailwindCSS](https://tailwindcss.com)
- **Visualization**:
  - [React Flow](https://reactflow.dev) (@xyflow/react)
- **Code Editing**:
  - [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **3D Effects**:
  - [Three.js](https://threejs.org) with [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- **Animation**:
  - [Motion/React](https://www.framer.com/motion/) (Framer Motion)
- **Authentication**:
  - [Supabase Auth](https://supabase.com/auth)
- **State Management**:
  - Custom stores
- **Styling**:
  - TailwindCSS with custom effects
- **Icons**:
  - [Lucide React](https://lucide.dev)

---

## 🔐 Environment Variables

To run this project, you'll need to set up the following environment variables in a `.env.local` file at the root of your project:

### Required Variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key for client-side authentication
- `STRIPE_SECRET_KEY`: For premium subscription features
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: For client-side Stripe integration

To obtain these keys:

1.  Create a Supabase project at [supabase.com](https://supabase.com)
2.  Set up a Stripe account at [stripe.com](https://stripe.com)

⚠️ **Important**: Never commit your `.env.local` file to version control. It's already included in `.gitignore` to prevent accidental exposure of your API keys.

---

## 📁 Project Structure

```
json-visualiser/
├── app/                # Next.js app directory
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── editor/         # JSON editor and visualization
│   ├── landing-page/   # Marketing landing page
│   ├── pricing/        # Subscription plans
│   └── protected/      # Premium features
├── components/         # Global UI components
│   ├── Auth/           # Authentication components
│   ├── ui/             # UI components
│   └── Visualizers/    # Visualization components
├── constants/          # Application constants
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── public/             # Static assets
├── services/           # API service functions
├── store/              # State management
├── styles/             # CSS styles
│   ├── base/           # Base styles
│   ├── components/     # Component styles
│   └── utils/          # Utility styles
└── utils/              # Helper utilities
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to contribute:

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the `LICENSE` file for details.
