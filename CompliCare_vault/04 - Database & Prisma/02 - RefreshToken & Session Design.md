#### 1) Purpose
The RefreshToken model stores the refresh-token session records for CompliCare users. 
It supports to get new access token  without asking for the user to login again every time short 
access token expires. 

### 2) Access Token vs Refresh Token 
- Access Token: Used to authorize API requests. Current design sets its lifetime to 15 mins .
- Refresh Token : Used to request new access token if the refresh token is valid. Current design sets its lifetime to 7 days. 

The Backend must validate refresh-token before issuing new access token . 

### 3) RefreshToken Fields 
- id: unique record ID, generate with UUID. 
- token: stores the SHA-256 hash the refresh token, not the raw token.
- userId: references the user who owns the session. 
- expiresAt: the session token expiration date/time.
- createdAt: when record was created. 

### 4) Relationship to User
`userId` references `User.id` through a Prisma relation.
One user can have multiple refresh-token records, for example, from separate login sessions.
`onDelete: Cascade` means deleting a User record also deletes its related RefreshToken records.


### 5) Security Decision's
- Refresh tokens are generated using cryptographically secure random bytes. 
- Only the SHA-256 hash get stored in the database. 
- The raw refresh token is delivered to browser in an HTTP Only cookie.
- The backend hashes the presented token to find its corresponding stored record.
- The backend must check expiry and apply the appropriate session-validation rules before issuing a new access token.

### 6) Indexes 
- @@index([userId]): help queries that retrieves a user refresh-token records.
- @@index([expiresAt]): can help queries that find expired records.
   indexes improve query performance
   
### 7) Key Design Principle

**The User represents the person,  RefreshToken represents a refreshable login session associated with that person.**
The session record supports expiry checks and session management without storing the raw refresh token in the database.
   



  