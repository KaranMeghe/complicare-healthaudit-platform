
### 1) Purpose

CompliCare is multi-tenant SaaS application. Different Hospitals use the same application, but their data and access must remain seprated . 

### 2) Three Models 
#### User
Represents person account and identity. 

Fields: 
- id: primary key, unique user identifier 
- email: unique email 
- passwordHash: hashed password 
- firstName , lastName: person name 
- createdAt, updatedAt: timestamps

A user account does not mean the person belongs to the organization . 

#### Organization
Represent client organization such as Hospital, clinic, lab.

Fields: 
- id: Primary key, unique organization identifier 
- name: Organization name
- description: optional details 
- isActive: organization active or not 
- createdAt, updatedAt: timestamps 

An organization is stored separately so its information is not duplicated in every user record. 

#### UserRole 
Represent a users membership and role with organization.

Fields: 
 - userId: References User.id
 - organizationId: References Organization.id 
 - role: membership Role
 - assignedAt: When the role was assigned


### 3) Relationships

- UserRole.userId references to User.id 
- UserRole.organizationId references to Organization.id
- @relation defines these relationship in prisma 
- Foreign key ensure that membership records references existing users and organizations.


### 4) Composite Primary key 

@@id([userId, organizationId])
The Combination of userId and organizationId uniquely create a primary id and  identifies a membership and this prevents user to have same role in organization. 


### 5) Why Organization Membership is Separate 

Only External Auditor can have one account and may belongs to multiple organizations. 
Keeping membership/role supports this without creating new account for new organization. 


### 6) Business Rules 

- An external auditor may belong to multiple organizations, but must have the `AUDITOR` role in each.
- `ADMIN` and `AUDITEE` users are limited to one organization.
- A user cannot be an `ADMIN` in one organization and an `AUDITOR` in another.
- These cross-organization membership rules must be enforced by backend business logic; the current composite primary key does not enforce them by itself.

