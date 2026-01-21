# API Endpoints Specification

## eLogbook Module

### 1. Submit Daily Log
*   **Method**: `POST`
*   **Endpoint**: `/api/logs`
*   **Access**: `Student`
*   **Middleware**: `Auth`, `PrivacyGuard`
*   **Body**:
    ```json
    {
        "date": "2023-10-27",
        "activity_description": "Worked on backend API integration...",
        "image_url": "https://bucket.s3.../img.jpg"
    }
    ```

### 2. Get Student Logs (Dashboard)
*   **Method**: `GET`
*   **Endpoint**: `/api/logs`
*   **Access**: `Student`
*   **Query Params**: `?week=10`, `?month=October`

### 3. Supervisor View Pending Logs
*   **Method**: `GET`
*   **Endpoint**: `/api/logs/pending`
*   **Access**: `Supervisor`, `Admin`

### 4. Approve/Reject Log
*   **Method**: `PATCH`
*   **Endpoint**: `/api/logs/:id/status`
*   **Access**: `Supervisor`
*   **Body**:
    ```json
    {
        "status": "approved",
        "supervisor_comment": "Great work, specific detail on the API implementation noted."
    }
    ```

### 5. Get Notifications (Missed Logs)
*   **Method**: `GET`
*   **Endpoint**: `/api/notifications`
*   **Access**: `Student`, `Supervisor`
*   **Note**: Triggered by cron job if logs missing > 3 days.

## Privacy & Users

### 1. Register (With Consent)
*   **Method**: `POST`
*   **Endpoint**: `/api/auth/register`
*   **Body**:
    ```json
    {
        "email": "student@uni.edu",
        "password": "...",
        "role": "student",
        "consent": true,
        "policy_version": "v1.0"
    }
    ```

### 2. Revoke Consent (Right to Erasure/Stop Processing)
*   **Method**: `POST`
*   **Endpoint**: `/api/privacy/revoke`
*   **Access**: `All`
