# PianoMentor <img width="30" height="30" alt="obraz" src="https://github.com/user-attachments/assets/cde92867-830e-4c22-9cbf-028f62cbe58f" />

PianoMentor is a web application for learning and practicing piano fundamentals.  
The project combines an interactive virtual piano, music theory exercises, and user progress tracking.

It was built as a full-stack learning project with a focus on clean architecture, real-world features, and testability.


## Features

### Interactive Virtual Piano
<p align="center">
  <img width="100%" alt="Virtual Piano Interface" src="https://github.com/user-attachments/assets/ad323208-d3a0-45a2-a18c-9d7d79169702" />
</p>

Interactive Virtual Piano is a browser-based instrument covering three full octaves **C3 to C6**, including all chromatic notes. Each key is mapped to a dedicated MP3 sample exported from **FL Studio**, ensuring realistic tone and dynamic response.

The application supports multiple input methods, including mouse interaction, touch controls, and computer keyboard mapping (e.g., 'z' for C4), allowing users to play seamlessly across devices. The audio engine incorporates natural dampening on key release, enhancing the authenticity of the playing experience.


### Music Theory Exercises
<p align="center">
  <img height="400" style="vertical-align:top;" src="https://github.com/user-attachments/assets/dfb93f6e-9e65-4f62-8e1e-deafd2bdb4a3" />
  &nbsp;
  <img height="400" style="vertical-align:top;" src="https://github.com/user-attachments/assets/96cc4b60-7d8e-4dca-b55b-583dcd2a6c12" />
</p>

The platform includes a structured set of 18 music theory exercises organized into five categories: **note reading** (treble and bass clef), **interval recognition** (ear training), **melody recognition**, **tonality identification** (major and minor), and **chord recognition**.

Each exercise features a three-level adaptive difficulty system. The Easy level focuses on a limited note range and includes 10 questions. Medium expands the range and increases the number of questions to 15. The Hard level utilizes the full chromatic scale, contains 20 questions, and introduces a countdown timer to increase complexity and encourage faster decision-making.


### User Progress Tracking
<p align="center">
  <img width="100%" alt="User Progress Dashboard" src="https://github.com/user-attachments/assets/cba6d394-75e0-4d0a-8a38-d246ce723c09" />
</p>

User performance is continuously monitored and presented through dynamic progress indicators that update in real time. The achievement system visually represents skill progression across four stages:
  - ![#dc3545](https://placehold.co/15x15/dc3545/dc3545.png) 0–24% - **Beginner**  
  - ![#E46E00](https://placehold.co/15x15/E46E00/E46E00.png) 25–49% - **Improving**  
  - ![#28a745](https://placehold.co/15x15/28a745/28a745.png) 50–99% - **Proficient**  
  - ![#E1B900](https://placehold.co/15x15/E1B900/E1B900.png) 100% -  **Mastery**  

All progress data is securely stored using Firebase Authentication and Firestore, ensuring reliable account-based tracking and persistence across sessions.


### Educational Content & CMS
<p align="center">
  <img height="350" src="https://github.com/user-attachments/assets/38eb88c5-cf87-4446-845a-b6b718f49d94" />
</p>

The project includes a built-in content management system designed for creating and maintaining structured educational materials. A rich text editor powered by **React Quill** enables administrators to produce well-formatted theory articles with embedded multimedia and interactive elements.

Custom interactive components, such as the **Circle of Fifths** and **Notes Picker**, can be directly integrated into articles to enhance the learning experience. Role-based access control ensures that only authorized users can create, edit, or remove content.

### Dynamic Music Notation (VexFlow)
<p align="center">
  <img height="450" src="https://github.com/user-attachments/assets/bd73fd95-9391-400a-b4ac-a2248c33ad51" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img height="450" src="https://github.com/user-attachments/assets/2c2cdbfc-8290-4ba8-9710-9b0307b9fae9" />
</p>

Music notation is dynamically generated using **VexFlow**, enabling real-time rendering of sheet music based on exercise parameters. The rendering engine automatically manages clef selection (treble or bass), key signatures, accidentals, and stem direction according to pitch, ensuring accurate and visually correct notation aligned with standard music engraving principles.

## Tech Stack
### Frontend
[![React][React.js]][React-url]
[![React Router][ReactRouter]][ReactRouter-url]

### Backend / Services
[![Firebase][Firebase]][Firebase-url]

### Testing
[![Cypress][Cypress]][Cypress-url]

### Other Libraries
[![VexFlow][VexFlow]][VexFlow-url]
[![React Quill][ReactQuill]][ReactQuill-url]
[![Font Awesome][FontAwesome]][FontAwesome-url]

[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Firebase]: https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black
[Firebase-url]: https://firebase.google.com/
[ReactRouter]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white
[ReactRouter-url]: https://reactrouter.com/
[Cypress]: https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e
[Cypress-url]: https://www.cypress.io/
[VexFlow]: https://img.shields.io/badge/VexFlow-CCA500?style=for-the-badge
[VexFlow-url]: https://www.vexflow.com/
[ReactQuill]: https://img.shields.io/badge/React_Quill-555555?style=for-the-badge&logo=quill&logoColor=white
[ReactQuill-url]: https://github.com/zenoamaro/react-quill
[FontAwesome]: https://img.shields.io/badge/Font_Awesome-339AF0?style=for-the-badge&logo=font-awesome&logoColor=white
[FontAwesome-url]: https://fontawesome.com/

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/pianomentor.git
cd pianomentor
npm install
```

### Environment Configuration

Create a `.env` file in the project root and provide your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MEASUREMENT_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Run the Application

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Testing

End-to-end tests are implemented using Cypress.

### Test Setup

Copy the example configuration file:

```bash
cp cypress/fixtures/cypress.env.example.json cypress/fixtures/cypress.env.json
```

Provide credentials for a test user account.  
The file is ignored by Git to prevent leaking sensitive data.

### Run Tests

```bash
npx cypress open
```

## Project Status

This project has reached a stable state and fulfills its original assumptions and goals.  
It is not under active development, but the repository is kept as a completed reference project showcasing architecture, features, and testing practices.

---

Built as a personal learning project focused on practical frontend and backend development.
