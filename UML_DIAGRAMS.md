# Notla Project UML Diagrams

This document contains UML diagrams for the project. To ensure clarity and readability, the Frontend architecture has been split into **UI Structure** and **Logic & Services**, making them comparable in size and complexity to the **Backend Models** diagram.


## 1. Backend Class Diagram (Django Models)

![Backend Diagram](backend_diagram.png)

Represents the database schema, domain entities, and their inheritance.

```mermaid
classDiagram
    %% External Classes
    class AbstractUser {
        +String username
        +String password
        +String first_name
        +String last_name
        +String email
        +Boolean is_staff
        +Boolean is_active
        +date_joined
    }

    %% Project Models
    class User {
        +String email
        +Boolean is_verified
        +DateTime created_at
        +__str__()
    }

    class Course {
        +String code
        +String name
        +String description
        +String instructor
        +DateTime created_at
        +DateTime updated_at
        +__str__()
    }

    class Note {
        +String title
        +String description
        +File file
        +String file_type
        +Integer file_size
        +Integer download_count
        +Integer view_count
        +DateTime created_at
        +DateTime updated_at
        +__str__()
    }

    class Review {
        +Integer rating
        +String comment
        +Boolean is_anonymous
        +Integer difficulty
        +Integer workload
        +DateTime created_at
        +DateTime updated_at
        +__str__()
    }

    %% Relationships
    User --|> AbstractUser : inherits
    User "1" --> "*" Note : uploads
    Course "1" --> "*" Note : contains
    User "1" --> "*" Review : writes
    Course "1" --> "*" Review : has
```

## 2. Frontend UI Structure (React Pages & Components)

![Frontend UI Diagram](frontend_ui.png)

Represents the visual hierarchy and composition of the application.

```mermaid
classDiagram
    namespace Pages {
        class Home
        class Login
        class Register
        class CourseList
        class CourseDetail
        class About
        class Profile
    }

    namespace Components {
        class Navbar
        class Logo
    }

    %% Relationships
    Home ..> Navbar : uses
    Login ..> Navbar : uses
    Register ..> Navbar : uses
    CourseList ..> Navbar : uses
    CourseDetail ..> Navbar : uses
    About ..> Navbar : uses
    Profile ..> Navbar : uses
    
    Navbar ..> Logo : contains
```

## 3. Frontend Logic & Services

![Frontend Logic Diagram](frontend_logic.png)

Represents the data layer, API communication, and their consumers.

```mermaid
classDiagram
    namespace Services {
        class AuthService {
            +login(credentials)
            +register(userData)
            +logout()
            +getCurrentUser()
        }
        class CourseService {
            +getAllCourses()
            +getCourseByCode(code)
            +getCourseNotes(id)
            +getCourseReviews(id)
        }
        class Api {
            +axiosInstance
            +interceptors
        }
    }

    namespace Consumers {
        class Login
        class Register
        class CourseList
        class CourseDetail
    }

    %% Relationships
    Login ..> AuthService : calls
    Register ..> AuthService : calls
    
    CourseList ..> CourseService : calls
    CourseDetail ..> CourseService : calls
    
    AuthService ..> Api : uses
    CourseService ..> Api : uses
```


## Description

### Backend
- **User**: Extends Django's `AbstractUser` to add email-based login and verification.
- **Course**: Core entity representing university courses.
- **Note** & **Review**: Related entities linked to both Users and Courses.

### Frontend
- **UI Structure**: Shows how Pages compose reusable Components like `Navbar`.
- **Logic & Services**: Shows how Pages interact with Services to fetch data, and how Services use the central `Api` configuration.
