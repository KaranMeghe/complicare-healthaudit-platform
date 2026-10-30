

# Diagram 1 — Complete Database ER Diagram

```mermaid
erDiagram
    USER {
        string id PK "UUID"
        string email  "Unique email"
        string passwordHash "Hashed password"
        string firstName
        string lastName
        datetime createdAt
        datetime updatedAt
    }

    ORGANIZATION {
        string id PK "UUID"
        string name
        string description "Optional"
        boolean isActive "Default true"
        datetime createdAt
        datetime updatedAt
    }

    USER_ROLE {
        string userId  FK "References USER.id"
        string organizationId  FK "References ORGANIZATION.id"
        enum role "ADMIN AUDITOR AUDITEE"
        datetime assignedAt
    }

    REFRESH_TOKEN {
        string id PK "UUID"
        string token UK "SHA-256 hash"
        string userId FK "References USER.id"
        datetime expiresAt
        datetime createdAt
    }

    USER ||--o{ USER_ROLE : "has memberships"
    ORGANIZATION ||--o{ USER_ROLE : "has members"
    USER ||--o{ REFRESH_TOKEN : "has sessions"
```

# Diagram 2 — How membership works


 ### CompliCare — Organization Membership Flow

```mermaid
flowchart TD
    U["User Account<br/>Rahul Sharma<br/>One user ID"]

    UR1["UserRole Record 1<br/>userId: U101<br/>organizationId: ORG01<br/>role: AUDITOR"]

    UR2["UserRole Record 2<br/>userId: U101<br/>organizationId: ORG02<br/>role: AUDITOR"]

    O1["Organization A<br/>City Central Hospital"]
    O2["Organization B<br/>Sunrise Medical Center"]

    U -->|"User.id = userId"| UR1
    U -->|"User.id = userId"| UR2

    UR1 -->|"organizationId = id"| O1
    UR2 -->|"organizationId = id"| O2
```

# Diagram 3 — Refresh-token session relationship


# CompliCare — Refresh Token Relationship

```mermaid
flowchart TD
    U["User<br/>id: U101"]

    R1["RefreshToken Record 1<br/>id: RT01<br/>token: SHA-256 hash<br/>expiresAt: expiry time"]

    R2["RefreshToken Record 2<br/>id: RT02<br/>token: SHA-256 hash<br/>expiresAt: expiry time"]

    U -->|"userId references User.id"| R1
    U -->|"userId references User.id"| R2

    D["If User is deleted"]
    C["Related RefreshToken records<br/>are deleted by ON DELETE CASCADE"]

    U -.-> D
    D --> C
```
