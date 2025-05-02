# LinkUp - Bachelor's Thesis Project

### Project Overview:

LinkUp is a social media platform developed as part of a Bachelor's thesis project. It enables seamless communication and content sharing among users. The platform offers real-time chats, group conversations, file sharing, and Markdown-based posts — all wrapped in a clean, responsive user interface. The focus is on delivering a reliable, user-friendly experience that supports modern social interaction needs.

## Key features

### Chats

LinkUp supports real-time chats, enabling users to send and receive messages instantly, react to messages, and share files seamlessly within conversations. Users can also assign aliases to personalize their chat experience. In group chats, users have the flexibility to add new members and modify chat settings, such as changing the group name, group photo, ensuring a customized and manageable communication environment.

![](/docs/chat-dark.png)

LinkUp manages chat settings and creating new chats with intuitive dialogs.
![](/docs/chat-dialog.png)

### Posts

In LinkUp, users can create and share posts using Markdown, allowing for rich text formatting, code snippets, and more. This flexibility enables users to craft detailed posts with headings, lists, links, and other elements commonly used in modern content creation. Whether sharing thoughts, updates, or technical content, the Markdown-based system provides an intuitive way to compose posts while maintaining full control over the appearance and structure.

![](/docs/post.png)

![](/docs//post-editor.png)

### Themes

LinkUp features a convenient toggle button that allows users to switch effortlessly between light and dark mode. This option provides a customizable viewing experience, letting users choose the display that best suits their preferences or ambient lighting conditions.

![](/docs/chat-light.png)

### Responsive Web Design

LinkUp employs responsive web design to ensure a seamless user experience across all devices. The platform automatically adjusts its layout and functionality to fit various screen sizes, from desktop monitors to smartphones and tablets. This adaptability provides consistent performance and ease of use, regardless of the device being used.

![](/docs/chat-phone.png)

## Technologies used

- **Frontend:** Developed with **React** for a dynamic and responsive user interface.
- **Backend:** Utilizes **Express** as the web server framework for efficient request handling and routing.
- **Database:** **PostgreSQL** is used for reliable data storage.
- **File Storage:** **S3** is used for reliable file storage.
- **ORM:** **Prisma** facilitates seamless interaction between Express and MySQL.

## Getting Started

To set up and run LinkUp on your local machine, follow these steps:

1. **Install Prerequisites**  
   Ensure the following are installed on your system:

   - [Docker](https://www.docker.com/) and Docker Compose
   - [Node.js](https://nodejs.org/)

2. **Clone the Repository**  
   Clone the project repository to your local machine:

   ```bash
   git clone https://github.com/misat1505/linkup.git
   cd linkup
   ```

3. **Run with Docker**  
   Use the provided `docker-compose.sh` script to manage and run the application. This script supports various modes: production, development and end-to-end testing.

   - **Run Production Environment:**  
     Starts the application with all services required for production:

     ```bash
     ./docker-compose.sh prod
     ```

   - **Run Tests:**  
     Execute following commands:

     ```
     cd backend
     npm install
     npm run test
     ```

   - **Run Load Tests for Backend:**  
     Start the app:

     ```bash
     ./docker-compose.sh dev
     ```

     And execute following commands:

     ```
     cd backend
     npm install
     npm run test:load:report
     ```

   - **Run e2e Tests:**  
     Start the app in e2e mode:

     ```bash
     ./docker-compose.sh e2e
     ```

     And execute following commands:

     ```
     cd frontend
     npm install
     npm run cypress:open
     ```

   - **Run Development Environment:**

     Start database, socket and S3 for development:

     ```
     ./docker-compose.sh dev
     ```

     Then to run backend execute the following commands:

     ```
     cd backend
     npm install
     npm run dev
     ```

     Then to run frontend execute the following commands:

     ```
     cd frontend
     npm install
     npm run dev
     ```
