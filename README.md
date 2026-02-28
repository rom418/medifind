Medfind is a modern healthvare search platfrom that helps users ickly find medical facilities, doctors, and healthcare services in their area. THis repository contains the frontend application built to deliver a fast, responsive and user friendly experience. The goal of Medifind is to simplify access to helthcare information and improve user experience irrespective of their age. 

Tech Stack
-Frontend- HTML,CSS
-Backend-MySql,Python,Flask

Features
-Search funtionality for hospitals, clients and doctors
-Location based filtering
-Detailed healthcare provider information
-Fast and intuitive user interface


<img width="1624" height="479" alt="Screenshot 2026-02-28 091953" src="https://github.com/user-attachments/assets/2a133159-9a26-4184-9dfa-08529d987eea" />

<img width="1777" height="947" alt="Screenshot 2026-02-28 092031" src="https://github.com/user-attachments/assets/af5765e9-3ad1-4425-846a-d2f63498b94e" />

<img width="1133" height="543" alt="Screenshot 2026-02-28 092130" src="https://github.com/user-attachments/assets/e681f296-4a7b-499b-91c1-8cf87b31b2dd" />

<img width="1395" height="867" alt="Screenshot 2026-02-28 092208" src="https://github.com/user-attachments/assets/2efedc58-da41-4df2-bcb9-78b48b8ca7be" />

<img width="494" height="867" alt="Screenshot 2026-02-28 092235" src="https://github.com/user-attachments/assets/9ad7a542-46c4-4d49-ab6b-bf627901a785" />



https://github.com/user-attachments/assets/680a7408-895a-460d-adb3-6980d7a7c271


https://github.com/user-attachments/assets/48280ac4-d69c-48ce-ab6c-3f36b69802f0



Frontend Architecture

<img width="2086" height="1669" alt="rontend architecture" src="https://github.com/user-attachments/assets/c22cdf3f-decd-47c1-a7a7-714ebea2936a" />


          +----------------+
                      |   Landing Page |  
                      |  (MEDIFIND)    |
                      +----------------+
                                |
              +-----------------+-----------------+
              |                                   |
     View Appointment Options              View History
              |                                   |
              v                                   v
   +------------------------+          +------------------+
   |  Select Body Part/Dept |          | Appointment List |
   +------------------------+          +------------------+
              |                                   |
              v                                   |
   +------------------------+                     |
   |  Choose Specialist     |                     |
   +------------------------+                     |
              |                                   |
              v                                   |
   +------------------------+                     |
   |  Select Date & Time    |                     |
   +------------------------+                     |
              |                                   |
              v                                   |
   +------------------------+                     |
   |   Confirm Booking      |                     |
   +------------------------+                     |
              |                                   |
              v                                   |
   +------------------------+                     |
   |  Booking Success /     |                     |
   |  Confirmation Screen   |                     |
   +------------------------+                     |
              |                                   |
              +--------------->--------------------+
                                Go Back / Home




