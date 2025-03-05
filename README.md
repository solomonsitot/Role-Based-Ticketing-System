```
# Project Setup

This project consists of both **frontend** and **backend** components. You will need to configure two `.env` files—one for the frontend and one for the backend. 

## **Frontend Setup (.env)**

The frontend uses the **Vite** build tool. To configure the connection to the backend, you need to specify the backend URL in the `.env` file in the frontend folder.

### **Frontend `.env` file:**

```env
VITE_BACKEND_URL=""
```

- **VITE_BACKEND_URL**: This is the URL of your backend server. Ensure that this variable is set to the correct address of your backend (e.g., `http://localhost:5000` for local development or the production URL for deployment).

## **Backend Setup (.env)**

The backend uses a server running on a specific port and requires a secret token for certain actions. You will need to set up the backend `.env` file accordingly.

### **Backend `.env` file:**

```env
URI=""
PORT=5000
PRIVATE_SECRET_TOKEN=""
```

- **URI**: The URI for the database connection (e.g., MongoDB URI or any other database URL).
- **PORT**: The port on which the backend server will run (e.g., `5000`).
- **PRIVATE_SECRET_TOKEN**: A private secret token used for authentication or other secure operations.

## **Steps to Setup**

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install the dependencies for both frontend and backend:

   For the **frontend**:
   ```bash
   cd frontend
   npm install
   ```

   For the **backend**:
   ```bash
   cd backend
   npm install
   ```

3. Create the `.env` files for both frontend and backend with the necessary values.

4. Run the backend server:
   ```bash
   npm start
   ```

5. Run the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

Your application should now be up and running!
```
