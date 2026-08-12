# Entity Relationship Diagram (ERD)

## 1. Overview

ERD MedStaff menggambarkan struktur data utama dan hubungan antar entity dalam sistem.

ERD ini dibuat berdasarkan:

- Software Requirements Specification (SRS)
- User Flow
- Wireframe
- Entity List
- ERD Relationship

---

## 2. ERD Diagram

```mermaid
erDiagram

    USER ||--|| EMPLOYEE : owns

    EMPLOYEE ||--o{ EMERGENCY_CONTACT : has
    EMPLOYEE ||--o{ EDUCATION : has
    EMPLOYEE ||--o{ EXPERIENCE : has

    EMPLOYEE ||--o{ ATTENDANCE : records
    ATTENDANCE ||--|| ATTENDANCE_PHOTO : contains

    EMPLOYEE ||--o{ LEAVE_REQUEST : submits
    EMPLOYEE ||--o{ PERMISSION_REQUEST : submits
    EMPLOYEE ||--o{ PROFILE_CHANGE_REQUEST : submits

    EMPLOYEE ||--o{ DOCUMENT : owns
    DOCUMENT ||--o{ DOCUMENT_CHANGE_REQUEST : has
    EMPLOYEE ||--o{ DOCUMENT_CHANGE_REQUEST : submits

    USER ||--o{ NOTIFICATION : receives

    USER ||--o{ APPROVAL : performs
    USER ||--o{ ANNOUNCEMENT : creates

    USER {
        int id PK
        string email
        string password
        string role
        string status
        datetime created_at
        datetime updated_at
    }

    EMPLOYEE {
        int id PK
        int user_id FK
        string employee_number
        string full_name
        string profile_photo
        string phone_number
        string email
        string birth_place
        date birth_date
        string gender
        string identity_number
        string address
        string company
        string position
        datetime created_at
        datetime updated_at
    }

    EMERGENCY_CONTACT {
        int id PK
        int employee_id FK
        string name
        string relationship
        string phone_number
        datetime created_at
        datetime updated_at
    }

    EDUCATION {
        int id PK
        int employee_id FK
        string institution
        string degree
        string field_of_study
        int start_year
        int end_year
        datetime created_at
        datetime updated_at
    }

    EXPERIENCE {
        int id PK
        int employee_id FK
        string company
        string position
        date start_date
        date end_date
        string description
        datetime created_at
        datetime updated_at
    }

    ATTENDANCE {
        int id PK
        int employee_id FK
        string attendance_type
        date attendance_date
        time attendance_time
        decimal latitude
        decimal longitude
        string location_address
        string status
        datetime created_at
        datetime updated_at
    }

    ATTENDANCE_PHOTO {
        int id PK
        int attendance_id FK
        string file_url
        string file_name
        datetime created_at
    }

    LEAVE_REQUEST {
        int id PK
        int employee_id FK
        string leave_type
        date start_date
        date end_date
        string reason
        string attachment
        string status
        datetime created_at
        datetime updated_at
    }

    PERMISSION_REQUEST {
        int id PK
        int employee_id FK
        string permission_type
        date date
        string reason
        string attachment
        string status
        datetime created_at
        datetime updated_at
    }

    PROFILE_CHANGE_REQUEST {
        int id PK
        int employee_id FK
        string change_type
        string old_value
        string new_value
        string reason
        string status
        datetime created_at
        datetime updated_at
    }

    DOCUMENT {
        int id PK
        int employee_id FK
        string document_type
        string document_number
        string file_url
        string file_name
        string status
        datetime created_at
        datetime updated_at
    }

    DOCUMENT_CHANGE_REQUEST {
        int id PK
        int employee_id FK
        int document_id FK
        string request_type
        string file_url
        string reason
        string status
        datetime created_at
        datetime updated_at
    }

    APPROVAL {
        int id PK
        int admin_user_id FK
        string request_type
        int request_id
        string action
        string note
        datetime created_at
    }

    NOTIFICATION {
        int id PK
        int user_id FK
        string title
        string message
        string notification_type
        boolean is_read
        datetime created_at
    }

    ANNOUNCEMENT {
        int id PK
        int admin_user_id FK
        string title
        string content
        string image_url
        datetime published_at
        string status
        datetime created_at
        datetime updated_at
    }