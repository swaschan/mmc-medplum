1. Adhere to the Full-Stack TypeScript Convention:

    All new code, whether for the frontend or backend, must be written in TypeScript to maintain type safety and code consistency across the project.[4]

2. Embrace the FHIR-Native Architecture:

    All data models and API interactions must conform to the FHIR standard.[3] Before implementing new data structures, consult the official FHIR documentation and the existing Medplum FHIR resource implementations.

    When creating or modifying resources, utilize the Medplum API, which is designed to handle FHIR-compliant data.[4]

3. Utilize the Existing Component Library:

    For any new user interface development, prioritize the use of Medplum's existing React component library.[4][6] This ensures a consistent look and feel and leverages pre-built functionalities.

    If a new component is necessary, it must be designed to be reusable and follow the established styling and architectural patterns of the existing library.

4. Respect the Backend Architecture:

    New backend logic should be integrated within the existing Express framework.[4]

    For asynchronous tasks and background processing, leverage the built-in Redis-based job queueing system.[4][5]

5. Manage Database Changes with Migrations:

    Directly altering the PostgreSQL database schema is prohibited. All database changes must be implemented through migration scripts to ensure version control and a consistent database state across all environments.

6. Implement Robust Authentication and Authorization:

    All new API endpoints and data access points must be protected by Medplum's built-in authentication and authorization mechanisms.[2]

    When adding features that handle sensitive patient data, ensure that access controls are granular and align with HIPAA best practices.

7. Write Comprehensive Tests:

    All new backend functionality must be accompanied by unit and integration tests.

    All new React components must have corresponding unit tests using a testing framework like Jest and React Testing Library.

8. Document Code Thoroughly:

    All new functions, classes, and complex logic must be clearly documented with comments.

    For significant new features, update the relevant sections of the project's documentation.

9. Follow the Established Git Workflow:

    All code modifications must be submitted via pull requests to the appropriate branch in the GitHub repository.

    Pull requests must include a clear description of the changes and pass all automated checks and tests before being considered for merging.

10. Leverage Medplum Bots for Server-Side Logic:

    For implementing custom server-side logic, automations, or workflows, utilize Medplum Bots whenever possible to avoid the need for provisioning separate server infrastructure.