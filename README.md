# 🎓 LinkUp - Bachelor's Thesis Project

### 📝 Project Overview:

LinkUp is a social media platform developed as a Bachelor's thesis project. It enables seamless communication and content sharing among users. The platform offers real-time chats, group conversations, file sharing, and Markdown-based posts — all wrapped in a clean, responsive user interface. The focus is on delivering a reliable, user-friendly experience that supports modern social interaction needs.

## 🧰 Tech Stack

- **Frontend:**  
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)  
  Built with **React** for a dynamic and responsive user interface.

- **Backend:**  
  ![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)  
  Uses **Express** for efficient request handling and routing.

- **Database:**  
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)  
  Reliable data storage powered by **PostgreSQL**.

- **File Storage:**  
  ![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazonaws&logoColor=white)  
  Stores and manages files with **Amazon S3**.

## ✨ Key Features

### 💬 Chats

LinkUp supports real-time chats, enabling users to send and receive messages instantly, react to messages, and share files seamlessly within conversations. Users can also assign aliases to personalize their chat experience. In group chats, users have the flexibility to add new members and modify chat settings, such as changing the group name, group photo, ensuring a customized and manageable communication environment.

![](/docs/chat-dark.png)

LinkUp manages chat settings and creating new chats with intuitive dialogs.  
![](/docs/chat-dialog.png)

### 📝 Posts

In LinkUp, users can create and share posts using Markdown, allowing for rich text formatting, code snippets, and more. This flexibility enables users to craft detailed posts with headings, lists, links, and other elements commonly used in modern content creation. Whether sharing thoughts, updates, or technical content, the Markdown-based system provides an intuitive way to compose posts while maintaining full control over the appearance and structure.

![](/docs/post.png)

![](/docs/post-editor.png)

### 🌗 Themes

LinkUp features a convenient toggle button that allows users to switch effortlessly between light and dark mode. This option provides a customizable viewing experience, letting users choose the display that best suits their preferences or ambient lighting conditions.

![](/docs/chat-light.png)

### 📱 Responsive Web Design

LinkUp employs responsive web design to ensure a seamless user experience across all devices. The platform automatically adjusts its layout and functionality to fit various screen sizes, from desktop monitors to smartphones and tablets. This adaptability provides consistent performance and ease of use, regardless of the device being used.

![](/docs/chat-phone.png)

## ⚙️ Getting Started

Follow these steps to set up and run **LinkUp** on your local machine:

### 1️⃣ Install Prerequisites

Make sure you have the following installed:

* [Docker](https://www.docker.com/) and Docker Compose  
* [Node.js](https://nodejs.org/)

---

### 2️⃣ Clone the Repository

Clone the project repository and navigate into the folder:

```bash
git clone https://github.com/misat1505/linkup.git
cd linkup
````

---

### 3️⃣ Run the Application

Use the `docker-compose.sh` script to manage and run the app. It supports multiple modes: production, development, and end-to-end testing.

> 📂 **Note:** After starting the application in any mode, open the [MinIO Console](http://localhost:9001) and manually create a bucket named `linkup-bucket`. This step is required for file uploads and storage to work properly.
>
> ✅ You only need to do this **once** — the bucket will persist between restarts.

* **🚀 Production Mode**
  Builds and runs optimized Docker images for deployment:

  ```bash
  ./docker-compose.sh prod
  ```

* **🛠️ Development Mode**
  Starts database, socket, and S3 services like production, plus runs backend and frontend in development mode with hot-module replacement enabled via attached volume:

  ```bash
  ./docker-compose.sh dev
  ```

* **🧪 End-to-End (e2e) Testing Mode**
  Start the app in e2e mode:

  ```bash
  ./docker-compose.sh e2e
  ```

  Then, in a separate terminal, run:

  ```bash
  cd frontend
  npm install
  npm run cypress:open
  ```
