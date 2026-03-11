# 🍽️ RestroManager: Modern Restaurant Ecosystem

RestroManager is a premium, full-stack restaurant management system designed for high-efficiency operations. It features a stunning, high-contrast user interface, a secure kitchen dispatch system, and robust administrative tools to manage everything from menu items to staff performance.

![Restaurant UI](https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2070)

## ✨ key Features

### 👨‍🍳 Advanced Kitchen Dashboard
- **PIN-Protected Access:** Secure kitchen entry using a fixed security PIN **`1906`**.
- **Live Order Tracking:** Real-time visibility of incoming orders with priority badges.
- **Prep Time Management:** Set and track estimated preparation times for every dish.
- **Ready Dispatch:** One-click notifications to mark orders as ready for service.

### 📋 Staff & Billing Systems
- **Dynamic Order Entry:** Seamlessly add items to tables with a sleek sidebar panel.
- **Customer Personalization:** Capture customer names directly during order entry.
- **Automated Billing:** Instant tax calculations (CGST/SGST) and professional receipt generation.
- **Order History:** Full audit trail for staff to review past orders and reprint bills.

### 🔐 Administrative Power
- **Menu Management:** Complete CRUD operations for dishes with image URL or upload support.
- **User & Staff Management:** Secure role-based access control for Admins and Staff.
- **Inventory Visibility:** Toggle item availability instantly to manage out-of-stock items.

---

## 🛠️ Technology Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** for lightning-fast builds
- **Tailwind CSS** for modern, responsive styling
- **Shadcn UI** for premium, accessible components
- **Lucide React** for consistent iconography
- **TanStack Query** (React Query) for efficient state management
- **Framer Motion** & **Sonner** for smooth animations and toasts

### Backend
- **Node.js** & **Express**
- **Sequelize ORM** for database modeling
- **MySQL** Database integration
- **JWT (JSON Web Tokens)** for secure authentication
- **Bcrypt.js** for password hashing

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MySQL Server

### 1. Database Setup
Create a database named `restaurant_db` and run the provided SQL script:
```bash
mysql -u your_user -p restaurant_db < backend/restaurant_db_setup.sql
```

### 2. Backend Configuration
Navigate to the `backend` folder and create a `.env` file:
```env
PORT=5000
DB_NAME=restaurant_db
DB_USER=root
DB_PASS=your_password
JWT_SECRET=your_secret_key
```
Then install and start:
```bash
cd backend
npm install
npm start
```

### 3. Frontend Configuration
Navigate to the `frontend/restaurant-management-sytem lov` folder:
```bash
cd frontend/restaurant-management-sytem\ lov
npm install
npm run dev
```

---

## 📸 Screenshots & Workflow

1. **Order Entry:** Staff adds items to a table and enters the customer's name.
2. **Bill Generation:** Payment is selected (Cash/Online) and a professional receipt is generated.
3. **Kitchen Sync:** The order appears instantly on the Kitchen Dashboard (after PIN verification).
4. **Completion:** Kitchen marks the order "Ready" for serving.

---

## 📄 License
This project is licensed under the ISC License.

---
*Developed with ❤️ for high-end dining experiences.*
