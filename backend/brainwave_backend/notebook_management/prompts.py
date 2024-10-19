example_response = """{{
    "React Basics": ["Introduction to React", "JSX", "Components", "Props", "State"],
    "React Advanced Concepts": [
        "Hooks",
        "Context API",
        "Error Boundaries",
        "Portals",
        "Ref",
    ],
    "React Router": [
        "Routing Basics",
        "Nested Routes",
        "Programmatic Navigation",
        "Route Guards",
        "Dynamic Routing",
    ],
    "State Management": [
        "Redux",
        "Redux Toolkit",
        "MobX",
        "Recoil",
        "Context API with useReducer",
    ],
    "Styling in React": [
        "CSS Modules",
        "Styled Components",
        "Emotion",
        "Tailwind CSS",
        "Sass in React",
    ],
    "Testing React": [
        "Jest",
        "React Testing Library",
        "Enzyme",
        "Cypress",
        "End-to-End Testing",
    ],
    "Performance Optimization": [
        "Code Splitting",
        "Lazy Loading",
        "Memoization",
        "React.memo",
        "useMemo and useCallback",
    ],
    "React with TypeScript": [
        "TypeScript Basics",
        "Typing Props and State",
        "Advanced Types",
        "Generic Components",
        "TypeScript with Hooks",
    ],
    "React and APIs": [
        "Fetching Data with Fetch API",
        "Using Axios",
        "GraphQL with Apollo Client",
        "React Query",
        "WebSockets in React",
    ],
    "Building and Deploying React Apps": [
        "Create React App",
        "Next.js",
        "Gatsby",
        "Vite",
        "Deployment Strategies",
    ],
}}"""


required_format = """{{
    "Subject": [
        "Subtopic 1", 
        "Subtopic 2",
        "Subtopic 3",
        "Subtopic 4", 
        "Subtopic 5"
    ],
    "Another Subject": [
        "Subtopic 1",
        "Subtopic 2",
        "Subtopic 3",
        "Subtopic 4",
        "Subtopic 5",
    ],
}}"""


system_message = """ You are a powerful AI designed to generate structured learning topics
    and subtopics for self-learning based on a given subject and desired level of expertise in JSON format.
    Please follow these important guideline:
    1. Do not include any additional information or formatting beyond the requested JSON object.
    2. Ensure that the response which you give is of JSON object, json type in python.

    Please provide the topics and subtopics in the following JSON format:
    {required_format}. Refer the below example of a ideal learning structure in JSON - for Topic: React and
    Level of Expertise: Intermediate - {example_response}."""
