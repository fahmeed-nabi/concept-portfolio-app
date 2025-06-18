# concept-portfolio-app
A full-stack web application for discovering and showcasing creative talent. Users can create public creative profiles with photos, bios, tags, and portfolio links, and browse or search through a directory of creators by name and creative field.

## Setup Instructions

### Prerequisites
* Python 3.10+
* Node.js 18+ and npm
* PostgreSQL

### Setup
0. Navigate to backend directory and install dependencies
```
pip install -r requirements.txt
```

1. Create a PostgreSQL DB named `concept_portfolio`:
```sql
-- 1. Create the database
CREATE DATABASE concept_portfolio;
```
2. Create a user and grant access:
   ```sql
   CREATE USER concept_dev WITH PASSWORD 'password123';
   GRANT ALL PRIVILEGES ON DATABASE concept_portfolio TO concept_dev;
This matches the information in the provided `.env` file. Or feel free to change to your own credentials.

4. Run migrations:
```
python manage.py migrate
```

5. Load initial data (for sample profiles and creative fields)
```
python manage.py loaddata portfolio_fixture.json
```
6. Start the development server (backend)
```
python manage.py runserver
```
The backend will run on http://127.0.0.1:8000/

7. Open a new terminal and navigate to the frontend directory. Start the React app
```
npm start
```
The frontend will run on http://localhost:3000

### Troubleshooting PostgreSQL Permission Denied Error
If you run 'python manage.py migrate' and see django.db.utils.ProgrammingError: permission denied for schema public:
1. Log in to the PostgreSQL CLI as the `postgres' superuser and switch to the project database:
```
psql -U postgres
\c concept_portfolio
```
2. Run these commands to authorize dev user
```sql
ALTER SCHEMA public OWNER TO concept_dev;
GRANT ALL ON SCHEMA public TO concept_dev;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO concept_dev;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO concept_dev;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO concept_dev;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO concept_dev;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO concept_dev;
```
3. Try running migrations again
```
python manage.py migrate
```

## AI Usage Notes

### Tools Used:
* ChatGPT 4o (OpenAI)
* GitHub Copilot
* Perplexity

### Example Prompts:

The following sections include example prompts for various aspects of the project. For each prompt, I provide an explanation for how AI helped.

#### Designing and Building Features
* Provide a full-stack project structure using Django for backend and React for frontend
  * This helped sketch a high-level architecture, separating backend and frontend folders, API design, and media/static handling.
* Generate a React form to create a profile with image upload, creative field selector, and 1 to 3 portfolio links.
  * Used to rapidly scaffold form logic, state management, and submission using FormData.
* Provide the Django models, serializers, and class-based views for the mentioned features and core requirements.
  * GitHub Copilot allowed me to rapidly create the web APIs for the frontend to consume, allowing me to focus more on the UI and UX aspects of this assignment.

#### Debugging and Error Fixes
* I am getting the following 'The submitted data was not a file' issue [image provided to AI tool]. Check the encoding type on the form.
  * ChatGPT helped pinpoint the issue to `multipart/form-data` configuration and how file inputs are handled with Axios and Django REST Framework.
* Received `creativeFIelds.map is not a function` during form rendering.
  * Copilot helped me diagnose the issue. This happened as the API response returned an object instead of an array. With the AI tool's help, I added a conditional fallback to extract res.data.results or use an empty array.
* Slugs are failing to generate due to uniqueness conflicts in existing records. Please provide a solution to this issue.
  * With Perplexity's guidance, I used a RunPython migration to generate slugs safely by appending numeric suffixes as needed. This helped resolve the integrity error on the unique slug field for profiles.

#### UI/UX and CSS Styling
* Suggest a clean, modern theme for a creative portfolio site, ideally a dark theme with some bright interactive action buttons. Generate the JSX and CSS with this style moving forward.
  * I wanted to establish a consistent and visually engaging aesthetic for my portfolio site. This allowed me to create something that feels creative and modern, but also accessible and readable. I leaned into the dark theme that makes creator content like images and links pop.
* Make a responsive profile card using CSS grid or flexbox, with image, name, tag, and links.
  * This provided a clean structure that I adapted for my creator cards.
* Ensure that external links in cards do not break layout and stack in an unwanted way.
   * This is an example of how AI helped me refine and polish display issues and improve readability for users.

The key takeaway here is that these AI tools played a major role in my development workflow. They helped with frontend development, backend/API development, debugging, and styling. Overall, AI sped up problem-solving and allowed me to produce a web application rapidly.

#### What Didn't Work Well
* ChatGPT sometimes assumed default DRF behavior (e.g. assuming fields like portfolio_links are simple strings instead of JSON lists), which caused subtle validation errors I had to debug manually.
* GitHub Copilot was very useful for boilerplate code but occasionally suggested incorrect prop types or unused imports in React.
* Some AI style suggestions were too verbose or did not align with my design goals and vision. I often had to iteratively refine it or rewrite suggestions.
* Prompts often had to be verbose or written multiple times as AI would not understand requirements/goals the first time. This can be attributed to the issue that it is hard to describe highly visual feedback.
* Chats/sessions in tools like ChatGPT and Perplexity would often slow down and become saturated due to the large amount of output. This meant that new chats had to begin, but these AI tools did not retain full project context over time (like how Copilot can see the codebase). As a result, follow-up prompts occasionally led to suggestions that ignored previous designs or code decisions, requiring re-clarification or reverting to manual fixes.
* While helpful for rapid prototyping, AI-recommended CSS fixes occasionally disrupted other layout elements, like causing buttons to stack or images to stretch and compress. These needed manual fine-tuning afterward or requesting AI-generated fixes.


