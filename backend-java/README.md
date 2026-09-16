# OptiStock AI - Java Spring Boot Backend

Production-ready Java Spring Boot backend for the **OptiStock AI Demand Forecasting & Inventory Optimization System**.

## 🛠️ Technology Stack
- **Framework:** Spring Boot 3.2.4 (Java 17+)
- **Modules:** Spring Web, Spring Data JPA, Lombok
- **Database:** H2 In-Memory Database (configured with `/h2-console`)
- **Port:** `5000` (matching the React frontend API service)

---

## 🚀 How to Run

### Option 1: Using Maven (from terminal)
```bash
cd backend-java
mvn spring-boot:run
```

### Option 2: Using Maven Wrapper / IDE
Open `backend-java` in **IntelliJ IDEA**, **Eclipse**, or **VS Code**, and run `com.optistock.OptiStockApplication.java`.

---

## 🔌 API Endpoints Exposed

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/summary` | KPI aggregates & 30-day demand totals |
| `GET` | `/api/products` | Retrieve all products (support `?status=`, `?category=`, `?search=`) |
| `POST` | `/api/products` | Create a new SKU item |
| `PATCH` | `/api/products/{id}` | Update stock level or price |
| `GET` | `/api/forecast` | Run AI demand prediction model (`?horizon=30`, `?seasonality=1.25`) |
| `GET` | `/api/sales` | Fetch multi-channel sales logs |
| `POST` | `/api/sales` | Record new channel sale & deduct stock |
| `GET` | `/api/purchase-orders` | List purchase orders in pipeline |
| `POST` | `/api/purchase-orders` | Issue new Purchase Order |
| `PATCH` | `/api/purchase-orders/{id}/receive` | Mark PO as received & deposit stock into inventory |
| `GET` | `/api/alerts` | List system anomaly alerts |
| `POST` | `/api/alerts/{id}/resolve` | Acknowledge & resolve alert |

---

## 🗄️ Database Console
- **H2 Console:** `http://localhost:5000/h2-console`
- **JDBC URL:** `jdbc:h2:mem:optistockdb`
- **User:** `sa`
- **Password:** *(leave blank)*
