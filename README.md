# Indian Tax and Expense Planner

Indian Tax and Expense Planner is a role-based, full-stack web application designed to assist Indian salaried employees, freelancers, and self-employed individuals in computing their income tax liability under both the Old and New Tax Regimes (as per the Income Tax Act, 1961, and Finance Act 2023–24). It also provides an integrated solution for tracking monthly and annual expenses, managing financial records, and obtaining personalized tax-saving recommendations.

## 🚀 Features

- **Dual-Regime Tax Computation:** Computes income tax under the Old Regime (deduction-inclusive) and New Regime (standard deduction only). Handles five income heads, surcharge slabs, Section 87A rebate, and 4% education cess.
- **Regime Comparison & Recommendation:** Provides a side-by-side comparison of tax liabilities and highlights the most beneficial regime for the user's specific profile.
- **Deduction Management:** Supports inputs for Section 80C, Section 80D, HRA, LTA, Section 80CCD(1B) NPS, and Standard Deduction.
- **Expense Tracking:** Add, edit, and categorize expense records (Housing, Food, Transport, Healthcare, Education, Entertainment, Savings, etc.) with monthly/annual aggregation.
- **Financial Dashboard:** Real-time statistics including total income, computed tax liability, effective tax rate, total expenses YTD, net savings, and deduction utilization percentage.
- **Role-Based Access Control (RBAC):** Supports three roles: USER (personal data), ACCOUNTANT (read-only access to client data), and ADMIN (system administration).
- **Secure Authentication:** Implements JWT access and refresh tokens with bcrypt-based password hashing.

## 🛠️ Technology Stack

- **Frontend:** React.js 18, Vite, React Router DOM, Tailwind CSS, Recharts / Chart.js
- **Backend:** Node.js 20, Express.js, Joi (Request Validation), JWT, bcrypt
- **Database:** MongoDB Atlas (Serverless), Mongoose ODM
- **Deployment:** Vercel (Frontend) and Render (Backend)

## 📁 Project Structure

```text
Indian-Tax-and-Expense-Planner/
├── client/              # React.js Frontend
│   ├── src/             # Source files (Components, Pages, Context, etc.)
│   ├── public/          # Static assets
│   ├── package.json     # Frontend dependencies
│   └── vite.config.js   # Vite configuration
├── server/              # Node.js + Express Backend
│   ├── APIs/            # Express Route Controllers
│   ├── Models/          # Mongoose Schemas (User, TaxProfile, Expense, etc.)
│   ├── Middlewares/     # Custom middlewares (Auth, Validation)
│   ├── package.json     # Backend dependencies
│   └── server.js        # Entry point
└── README.md
```

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas connection string)

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and configure the environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📄 License
This project is licensed under the MIT License.
