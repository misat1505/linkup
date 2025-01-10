# Link Up - Bachelor's Degree Project

### Project Overview:

Link Up is an under-development social media platform designed to facilitate easy communication and content sharing among users. Developed as part of a Bachelor's degree project, the platform provides essential features for chatting with individuals, creating group conversations, and sharing various types of files. The focus is on delivering a simple, user-friendly experience that meets the needs of modern social interactions.

## Key features

### Chats

Link Up supports real-time chats, enabling users to send and receive messages instantly, react to messages, and share files seamlessly within conversations. Users can also assign aliases to personalize their chat experience. In group chats, users have the flexibility to add new members and modify chat settings, such as changing the group name, group photo, ensuring a customized and manageable communication environment.

![](/docs/chat-dark.png)

Link Up manages chat settings and creating new chats with intuitive dialogs.
![](/docs/chat-dialog.png)

### Posts

In Link Up, users can create and share posts using Markdown, allowing for rich text formatting, code snippets, and more. This flexibility enables users to craft detailed posts with headings, lists, links, and other elements commonly used in modern content creation. Whether sharing thoughts, updates, or technical content, the Markdown-based system provides an intuitive way to compose posts while maintaining full control over the appearance and structure.

![](/docs/post.png)

![](/docs//post-editor.png)

### Themes

Link Up features a convenient toggle button that allows users to switch effortlessly between light and dark mode. This option provides a customizable viewing experience, letting users choose the display that best suits their preferences or ambient lighting conditions.

![](/docs/chat-light.png)

### Responsive Web Design

Link Up employs responsive web design to ensure a seamless user experience across all devices. The platform automatically adjusts its layout and functionality to fit various screen sizes, from desktop monitors to smartphones and tablets. This adaptability provides consistent performance and ease of use, regardless of the device being used.

![](/docs/chat-phone.png)

## Technologies used

- **Frontend:** Developed with **React** for a dynamic and responsive user interface.
- **Backend:** Utilizes **Express** as the web server framework for efficient request handling and routing.
- **Database:** **MySQL** is used for reliable data storage.
- **ORM:** **Prisma** facilitates seamless interaction between Express and MySQL.

## Getting Started

To set up and run Link Up on your local machine, follow these steps:

1. **Install Prerequisites**  
   Ensure the following are installed on your system:

   - [Docker](https://www.docker.com/) and Docker Compose
   - [Node.js](https://nodejs.org/) (if running locally without Docker)

2. **Clone the Repository**  
   Clone the project repository to your local machine:

   ```bash
   git clone https://github.com/misat1505/linkup.git
   cd linkup
   ```

3. **Run with Docker**  
   Use the provided `docker-compose.sh` script to manage and run the application. This script supports various modes: production, testing, backend development, and frontend development.

   - **Run Production Environment:**  
     Starts the application with all services required for production:

     ```bash
     ./docker-compose.sh prod
     ```

   - **Run Tests:**  
     Initializes the test database in docker:

     ```bash
     ./docker-compose.sh test
     ```

     And execute following commands:

     ```
     cd backend
     npm install
     npm run test
     ```

   - **Run Load Tests for Backend:**  
     Start the app:

     ```bash
     ./docker-compose.sh prod
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

     Start database for development:

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
