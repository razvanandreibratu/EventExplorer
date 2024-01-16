# Event Explorer

Event Explorer is a powerful application designed to make event discovery a breeze. Discover and explore events happening in your city or any chosen location effortlessly. The app leverages Elasticsearch for lightning-fast search capabilities and provides a set of RESTful endpoints for seamless integration.

## Event Explorer API

Explore and discover events effortlessly with the Event Explorer API. This API provides a set of endpoints for various functionalities related to event searching and discovery.


## Endpoints

| Endpoint                                 | Method | Description                                               |
| ---------------------------------------- | ------ | --------------------------------------------------------- |
| `/events/getEvents`                      | GET    | Get all events                                            |
| `/events/search/id/:id`                  | GET    | Get event by ID                                           |
| `/events/search/keyword/:keyword`        | GET    | Get events by title (keyword search)                      |
| `/events/create`                         | POST   | Create a new event                                        |
| `/events/update`                         | PUT    | Update an event's description by ID                       |
| `/events/delete/:id`                     | DELETE | Delete an event by ID                                     |
| `/events/delete`                         | DELETE | Delete all events                                         |

## Endpoints

### 🌐 Event Search

**Endpoint:** `GET /events/search`

Allows users to search for events based on keywords, location, date, or category.

**Parameters:**

- `q` (query): Search query (keywords).
- `location`: Location where the user wants to find events.
- `title`: Title of the event.
- `date`: Date range for events.
- `category`: Event category (e.g., music, sports, tech).

### 🎫 Event Details

**Endpoint:** `GET /events/{eventId}`

Fetches detailed information about a specific event.

**Parameters:**

- `eventId`: Unique identifier for the event.

### 📅 Event Creation

**Endpoint:** `POST /events/create`

Allows event organizers to add new events to the system.

**Request Body:**

- Event details (title, description, date, location, category).

### ✏️ Event Update

**Endpoint:** `PUT /events/update/{eventId}`

Allows event organizers to update information about an existing event.

**Request Body:**

- Updated event details.

### ❌ Event Deletion

**Endpoint:** `DELETE /events/delete/{eventId}`

Allows event organizers to remove an event from the system.

**Parameters:**

- `eventId`: Unique identifier for the event to be deleted.

### 🎉 Event Recommendations

**Endpoint:** `GET /events/recommendations`

Provides personalized event recommendations based on user preferences and past activity.

**Parameters:**

- User authentication token (for personalized recommendations).

## Technology Stack

- **Backend:** Node.js with Express.js for server-side development.
- **Frontend:** Vue.js for building dynamic and interactive user interfaces.
- **Database:** MongoDB for storing and managing data efficiently.
- **API Documentation:** Swagger for creating clear and comprehensive documentation of the RESTful endpoints.
- **Search Engine:** Elasticsearch for powerful event indexing and searching capabilities.
- **Authentication:** JWT (JSON Web Tokens) for securing and authenticating requests.
## Swagger Sample Code:
![ss](https://github.com/razvanandreibratu/EventExplorer/assets/108679928/5c1caff7-b150-420e-b1ba-8fbfe7343319)
![ss1](https://github.com/razvanandreibratu/EventExplorer/assets/108679928/17bddcb9-aed7-497d-abe6-982dae940a4f)

## Elasting Mapping:
![ss4](https://github.com/razvanandreibratu/EventExplorer/assets/108679928/558e1ad3-3e1c-46d5-a83f-807dc13f20f6)

## Usage Scenario

Imagine you want to find exciting concerts happening in your city this weekend. You can simply send a GET request to `/events/search` with parameters like `q=concert`, `location=CityName`, and `date=2024-01-20`.

Keep in mind that this is just a basic idea, and the actual implementation may require further considerations, such as error handling, pagination for large result sets, and securing the API with proper authentication mechanisms.
