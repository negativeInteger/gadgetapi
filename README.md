services/       -- Keep business logic clean and reusable
middlewares/    -- Centralized auth + RBAC
seeders/        -- Easy database population during dev
utils/          -- Small helper functions (JWT, Hashing, Logger)
tests/          -- Full Unit + Integration Testing
prisma/         -- DB schema + migrations

Checkpoint 1 ✅ DONE
✅ Folder Structure
✅ App Setup
✅ Server Running

Checkpoint 2: Database Design + Prisma Migrations

Table	        Fields	                                          Relations
Users	    id, username, password, role	                One-to-Many with Gadgets
Gadgets	    id, name, description, status, assigned_to	    Many-to-One with Users

Checkpoint 3: User Authentication

JWT Access Tokens	    Short-lived auth tokens	            ✅ Intermediate
Refresh Tokens	        Long-lived session management	        🔥 Advanced
JWT Rotation	        Extra Security Layer                🔐	🔥 Advanced
Blacklisting	        Manual Logout + Token Revoke	    🔥 Advanced
Zod Input Validation	Stop junk data at the gates     	✅ Intermediate
Bcrypt Hashing	        Secure password storage	            ✅ Intermediate
