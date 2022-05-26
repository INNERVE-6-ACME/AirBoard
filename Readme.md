# AirBoard
## 3rd prize at INNERVE Hackathon 6.0 (AIT Pune)
### 3rd/823 participations

Problem Addressed:
The inability of students without digital pads / touch-input laptops to express themselves effectively in online classes, leading to lack of communication in online studies.

Solution Approach:
- The teacher and students in a class can turn on their cameras and write in the air using hand gestures . 
- Live broadcast of every such drawing to all other students in form of a whiteboard (can be saved after each session for later reference) .
- This would result in more interest and participation of everyone in an online class.

# Backend api

Hosted at: https://airboard-backend-api.herokuapp.com/

## Endpoints
### User authentication
| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `POST`    | `/api/signup`                             | Create a new user.                      |
| `POST`   | `/api/login`                             | Returns an auth token for user.                       |


### Team and Session
| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `POST`    | `/api/addstudent/`                          | Add new student to a team.                       |
| `DELETE`  | `/api/addstudent/`                          | Delete student from a team.                 |
| `POST`   | `/api/addsession/`                 | Teacher can create a new session for meeting in a team.                 |
| `DELETE`    | `/api/addsession` | Teacher can delete a session from a team. |
| `POST` | `/api/savesession` | Save the whiteboard generated for current sesison.                    |
| `GET`    | `/api/session/56` | Give details about the session with id 56. |


## Websockets Endpoints
We have used websockets in this project to create a real time communication between all the users connected to same session/meeting.
Whenever something new is written on the board it should reflect to all the other users in that session.

#### Endpoint for the changes on board
`wss://airboard-backend-api.herokuapp.com/ws/board/<session_id>`

#### Endpoint for the saperate chat in each team
`wss://airboard-backend-api.herokuapp.com/ws/chat/<team_id>`

