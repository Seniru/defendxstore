# Backend

![Coveralls](https://img.shields.io/coverallsCoverage/github/Seniru/defendxstore?label=API%20coverage)

## Table of Contents

- [Setting up](#setting-up)
- [Available scripts](#available-scripts)
- [API Documentation](#api-documentation)
	- [Headers](#headers)
	- [Schemas](#schemas)
		- [`UserSchema`](#userschema)
		- [`PartialUserSchema`](#partialuserschema)
		- [`ItemSchema`](#itemschema)
		- [`PromoCodeSchema`](#promocodeschema)
		- [`OrderSchema`](#orderschema)
		- [`TicketSchema`](#ticketschema)
	- [Auth](#auth)
		- [`POST` `/auth/login` Login user](#post-authlogin-login-user)
	- [Users](#users)
		- [`GET` `/users` Get all users](#get-users-get-all-users)
		- [`POST` `/users` Create user](#post-users-create-user)
		- [`GET` `/users/:username` Get user](#get-usersusername-get-user)
		- [`GET` `/users/:username/reviews` Get reviews and ratings (delivery agent)](#get-usersusernamereviews-get-reviews-and-ratings-delivery-agent)
		- [`PUT` `/users/:username/profileImage` Change profile image](#put-usersusernameprofileimage-change-profile-image)
		- [`POST` `/users/:username/role` Add role to user](#post-usersusernamerole-add-role-to-user)
		- [`DELETE` `/users/:username/role/:role` Remove role from user](#delete-usersusernamerolerole-remove-role-from-user)
		- [`PATCH` `/users/:username/profile` Edit profile details](#patch-usersusernameprofile-edit-profile-details)
	- [Cart](#cart)
		- [`GET` `/users/:username/cart` Get cart](#get-usersusernamecart-get-cart)
		- [`POST` `/users/:username/cart` Add item to cart](#post-usersusernamecart-add-item-to-cart)
		- [`PUT` `/users/:username/cart` Edit cart](#put-usersusernamecart-edit-cart)
		- [`DELETE` `/users/:username/cart` Empty cart](#delete-usersusernamecart-empty-cart)
	- [Items](#items)
		- [`GET` `/items` List items](#get-items-list-items)
		- [`POST` `/items` Create new item](#post-items-create-new-item)
		- [`GET` `/items/:itemName` Get item](#get-itemsitemname-get-item)
		- [`DELETE` `items/:itemName` Delete item](#delete-itemsitemname-delete-item)
		- [`PATCH` `/items/:itemName` Edit item detail](#patch-itemsitemname-edit-item-detail)
		- [`POST` `/items/:itemName/restock` Restock item](#post-itemsitemnamerestock-restock-item)
		- [`GET` `/items/:itemName/reviews` Get items' reviews](#get-itemsitemnamereviews-get-items-reviews)
		- [`POST` `/items/:itemName/reviews` Add review to item](#post-itemsitemnamereviews-add-review-to-item)
		- [`DELETE` `/items/:itemName/reviews/:reviewId` Remove review from item](#delete-itemsitemnamereviewsreviewid-remove-review-from-item)
	- [Promotion codes](#promotion-codes)
		- [`GET` `/promo` List promotion codes](#get-promo-list-promotion-codes)
		- [`POST` `/promo` Create promotion code](#post-promo-create-promotion-code)
		- [`DELETE` `/promo/:promoCode` Delete promotion code](#delete-promopromocode-delete-promotion-code)
	- [Orders](#orders)
		- [`GET` `/orders` Get all orders](#get-orders-get-all-orders)
		- [`POST` `/orders` Checkout items from a cart](#post-orders-checkout-items-from-a-cart)
		- [`GET` `/orders/:orderId` Get order](#get-ordersorderid-get-order)
		- [`DELETE` `/orders/:orderId` Delete a completed order](#delete-ordersorderid-delete-a-completed-order)
	- [Deliveries](#deliveries)
		- [`POST` `/orders/:orderId/delivery` Acquire delivery (delivery agent)](#post-ordersorderiddelivery-acquire-delivery-delivery-agent)
		- [`PUT` `/orders/:orderId/delivery` Update order status](#put-ordersorderiddelivery-update-order-status)
		- [`GET` `/orders/:orderId/delivery/agent` Get delivery agent information](#get-ordersorderiddeliveryagent-get-delivery-agent-information)
		- [`POST` `/orders/:orderId/delivery/agent/reviews` Add review to delivery agent](#post-ordersorderiddeliveryagentreviews-add-review-to-delivery-agent)
	- [Sales](#sales)
		- [`GET` `/sales/:item` Get sales for an item](#get-salesitem-get-sales-for-an-item)
		- [`GET` `/sales/:item/:month` Get sales for an item for a month](#get-salesitemmonth-get-sales-for-an-item-for-a-month)
		- [`GET` `/sales/compare` Compare two items' performances](#get-salescompare-compare-two-items-performances)
		- [`GET` `/sales/monthly` Get monthly sales breakdown](#get-salesmonthly-get-monthly-sales-breakdown)
		- [`GET` `/sales/supplyMetrics` Get supply metrics](#get-salessupplymetrics-get-supply-metrics)
		- [`POST` `/sales/expenses/:month` Add a new expense for the month](#post-salesexpensesmonth-add-a-new-expense-for-the-month)
		- [`DELETE` `/sales/expenses/:expense` Delete the expense](#delete-salesexpensesexpense-delete-the-expense)
	- [Forums](#forums)
		- [`GET` `/forums` List all forum threads](#get-forums-list-all-forum-threads)
		- [`POST` `/forums` Create a new thread](#post-forums-create-a-new-thread)
		- [`GET` `/forums/:thread` Get forum thread](#get-forumsthread-get-forum-thread)
		- [`PUT` `/forums/:thread` Edit forum thread](#put-forumsthread-edit-forum-thread)
		- [`DELETE` `/forums/:thread` Delete forum thread](#delete-forumsthread-delete-forum-thread)
		- [`POST` `/forums/:thread/replies` Post a reply to a thread](#post-forumsthreadreplies-post-a-reply-to-a-thread)
	- [Tickets](#tickets)
		- [`GET` `/tickets` List all tickets](#get-tickets-list-all-tickets)
		- [ `POST` `/tickets` Create a new ticket](#post-tickets-create-a-new-ticket)
		- [`GET` `/tickets/:ticketId` Get ticket](#get-ticketsticketid-get-ticket)
		- [`PUT` `/tickets/:ticketId` Edit ticket](#put-ticketsticketid-edit-ticket)
		- [`PATCH` `/tickets/:ticketId` Set resolved status](#patch-ticketsticketid-set-resolved-status)
		- [`DELETE` `/tickets/:ticketId` Delete ticket](#delete-ticketsticketid-delete-ticket)


## Setting up

First, run the commands below in your terminal. This will install all the dependencies required.

```bash
# navigate to the backend directory
cd backend

# install dependencies
npm ci --include=dev
```

Then create the `.env` file in this directory with the following content

```bash
MONGO_URI="mongodb://127.0.0.1:27017/defendxstore?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.7"
SERVER_PORT=5000
JWT_SECRET=jwtsecret
ENVIRONMENT=development
```

- `MONGO_URI`: The MongoDB connection URL. Use the one given in the above example if you are running the database in the **local** environment.
If you are using MongoDB with **MongoDB Atlas** use the provided by them instead.

- `SERVER_PORT` and `JWT_SECRET` can be modified.

## Available scripts

- Issue `npm start` command to start the server.
- Issue `npm run prettify` to prettify the code

## API documentation

You can find the routes implemented by this API and their documentation below. All the requests and responses are in `json` format. Therefore set `application/json` to the `Content-Type` header

#### Headers
```sh
Content-Type: application/json
Authorization: Bearer <token>
```

### Schemas

These schemas take a common shape and will be mentioned in request/response bodies for convinience.

#### `UserSchema`
- `id`: User's id
- `username`
- `profileImage`
- `email`
- `deliveryAddress?`
- `contactNumbers[]?`
- `roles`: `[customer, support_agent, delivery_agent, admin]`

#### `PartialUserSchema`
- `id`: User's id
- `username`
- `profileImage`

#### `ItemSchema`
- `id`: Item id
- `name`
- `price`
- `description`
- `size`: `xs`|`s`|`m`|`l`|`xl`
- `color`
- `itemImage`

#### `PromoCodeSchema`
- `id`
- `code`
- `discount`
- `validTill`: `Date`

#### `OrderSchema`
- `user`: [`UserSchema`](#userschema)
- `ordered_date`
- `status`: `pending`|`on_the_way`|`delivered`
- `items`: [`ItemSchema[]`](#itemschema)
- `price`

#### `TicketSchema`
- `id`
- `title`
- `ticketType`: Ticket type (Inquiry, Complaint, etc.)
- `status`: `open`|`closed`
- `createdDate`
- `user`: [`PartialUserSchema`](#partialuserschema)

### Auth

#### `POST` `/auth/login` Login user

**Request body**
- **`email`**: User's email
- **`password`**: User's password

**Responses**

- `200 OK` Login successful
	-  **`token`**: Authorization token. Use this in the `Authorization` header.
- `401 Unauthorized` Invalid password
- `404 Not found` User not found


### Users

#### `GET` `/users` Get all users

**Query parameters**

- `search`: `String`. Search users with the query
- `type`: `customer`|`deliver_agent`|`support_agent`|`admin`. Filters with the type specified.

**Responses**

- `200 OK`
	- List of `users` filtered according to the query parameters: [`UserSchema[]`](#userschema)
- `400 Bad request`
	- Invalid inputs for request
	- Invalid `type`
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Admin only route

#### `POST` `/users` Create user

**Request body**

- `username`
- `password`
- `email`
- `profileImage`
- `deliveryAddress?`
- `contactNumbers[]?`

**Responses**

- `201 Created`: Returns `token`
- `400 Bad request`: Invalid inputs for the request

#### `GET` `/users/:username` Get user

**Responses**

- `200 OK`: Returns [`UserSchema`](#userschema)
- `401 Unauthorized`: Not logged in
- `403 Forbidden` Users can't request another user details
- `404 Not found`: User not found

#### `DELETE` `/users/:username` Delete user

**Responses**

- `200 OK`: Delete successful
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: User attempting to delete another user
- `404 Not found`: User not found

#### `GET` `/users/:username/reviews` Get reviews and ratings (delivery agent)

**Responses**

- `200 OK`:
	- `reviews`: `String[]`
	- `rating`: `Number`
- `404 Not found`: Delivery agent not found

#### `PUT` `/users/:username/password` Change password

**Request body**

- `password`: New password

**Responses**

- `200 OK`: Password change successful
- `400 Bad request`: Invalid inputs for the request
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: User trying to change another users' password
- `404 Not found`: User not found

#### `PUT` `/users/:username/profileImage` Change profile image

- `image`: New image

**Responses**

- `200 OK`: Image change successful
- `400 Bad request`: Invalid inputs for the request
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: User trying to change another users' image
- `404 Not found`: User not found

#### `POST` `/users/:username/role` Add role to user

**Request body**

- `role`: `customer`|`deliver_agent`|`support_agent`|`admin`

**Respones**

- `200 OK`: Role added successful
- `400 Bad request`
	- Invalid inputs for the request
	- Invalid `role`
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Admin only route
- `404 Not found`: User not found

#### `DELETE` `/users/:username/role/:role` Remove role from user

**Respones**

- `200 OK`: Role removed successfully
- `400 Bad request`: Invalid `role`
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Admin only route
- `404 Not found`: User not found


#### `PATCH` `/users/:username/profile` Edit profile details

Same as [`POST` `/users` Create user](#post-users-create-user)

**Responses**

- `401 Unauthorized`: Not logged in
- `403 Forbidden`: User trying to edit another user's details
- `404 Not found`: User not found

### Cart

#### `GET` `/users/:username/cart` Get cart

**Responses**

- `200 OK`: [`ItemSchema[]`](#itemschema)
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Request another user's cart

#### `POST` `/users/:username/cart` Add item to cart

**Request body**

- [`ItemSchema`](#itemschema)

**Respones**

- `200 OK`: Addition successful
- `400 Bad request`: Invalid inputs for the request
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Cannot add items to another user's cart

#### `PUT` `/users/:username/cart` Edit cart

**Request body**

- [`ItemSchema[]`](#itemschema)

**Responses**

- `200 OK`: Modification successful
- `400 Bad request`: Invalid inputs for the request
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Cannot modify another user's cart

#### `DELETE` `/users/:username/cart` Empty cart

**Responses**

- `200 OK`: Emptied successfully
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Cannot empty another user's cart

### Items

#### `GET` `/items` List items

**Query parameters**

- `category`: Men's, Women's, Unisex, Accessories, etc.
- `size`: `xs`|`s`|`m`|`l`|`xl`
- `color`
- `price_from`
- `price_to`
- `search`

**Responses**

- `200 OK`: [`ItemSchema[]`](#itemschema)
- `400 Bad request`: Invalid values to query parameters

#### `POST` `/items` Create new item

**Request body**

- [`ItemSchema`](#itemschema) instance

**Responses**

- `201 Created`: Created successfully
- `400 Bad request`: Invalid inputs for the request
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Admin only route

#### `GET` `/items/:itemName` Get item

**Responses**

- `200 OK`: [`ItemSchema`](#itemschema)
- `404 Not found`: Item not found

#### `DELETE` `items/:itemName` Delete item

**Responses**

- `200 OK`: Item deleted
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Admin only route
- `404 Not found`: Item not found

#### `PATCH` `/items/:itemName` Edit item detail

Same as [`POST` `/items` Create new item](#post-items-create-new-item)

**Responses**

- `404 Not found`: Item not found

#### `POST` `/items/:itemName/restock` Restock item

**Request body**

- `amount`: Restock amount

**Responses**

- `200 OK`: Restocked successfully
- `400 Bad request`: Invalid `amount` or `amount` not included
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Admin only route
- `404 Not found`: Item not found

#### `GET` `/items/:itemName/reviews` Get items' reviews

**Responses**

- `200 OK`
	- `rating`: `Number`. Rating posted on this item out of 5.0
	- `reviews`: List of
		- `review`
		- `rating`: Rating posted on this item by this user (out of 5.0)
		- `user`: [`PartialUserSchema`](#partialuserschema)
- `404 Not found`: Item not found

#### `POST` `/items/:itemName/reviews` Add review to item

**Request body**

- `rating`: `Number`. Rating out of 5.0
- `review`

**Responses**

- `200 OK`: Review added. Returns `reviewId`
- `400 Bad request`: Invalid inputs for the request
- `401 Unauthorized`: Not logged in
- `404 Not found`: Item not found

#### `DELETE` `/items/:itemName/reviews/:reviewId` Remove review from item

**Responses**

- `200 OK`: Review removed
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: User attempting to remove review of another user
- `404 Not found`
	- Item not found
	- Review not found

### Promotion codes

#### `GET` `/promo` List promotion codes

**Responses**

- `200 OK`: [`PromoCodeSchema[]`](#promocodeschema)
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Admin only route

#### `POST` `/promo` Create promotion code

**Request body**

- Instance of [`PromoCodeSchema`](#promocodeschema)

**Responses**

- `201 Created`: Code created succesfully
- `400 Bad request`: Invalid inputs for request body
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Admin only route

#### `DELETE` `/promo/:promoCode` Delete promotion code

**Responses**

- `200 OK`: Code deleted
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Admin only route
- `404 Not found`: Promo code not found

### Orders

#### `GET` `/orders` Get all orders

**Query parameters**

- `status`: `pending`|`on_the_way`|`completed`

**Responses**

- `200 OK`: [`OrderSchema[]`](#orderschema)
- `400 Bad request`: Invalid `status`
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Not logged in

#### `POST` `/orders` Checkout items from a cart

**Request body**

- `promo_code`: Optional. Promotion code

**Responses**

- `200 OK`: Checkout successful
- `400 Bad request`
	- Empty cart
	- Invalid `promo_code`
- `401 Unauthorized`: Not logged in

#### `GET` `/orders/:orderId` Get order

**Responses**

- `200 OK`: [`OrderSchema`](#orderschema)
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: User attempting to access order of another user. Delivery agents bypass this
- `404 Not found`: Order not found

#### `DELETE` `/orders/:orderId` Delete a completed order

**Responses**

- `200 OK`: Order deleted
- `401 Unauthorized`: Not logged in
- `403 Forbidden`
	- User attempting to delete another user's order
	- Order not completed
- `404 Not found`: Order not found

### Deliveries

#### `POST` `/orders/:orderId/delivery` Acquire delivery (delivery agent)

**Responses**

- `200 OK`: Delivery acquired
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Delivery agent only route
- `404 Not found`: Order not found
- `409 Conflict`: Delivery already acquired by another delivery agent

#### `PUT` `/orders/:orderId/delivery` Update order status

**Request body**

- `status`: `pending`|`on_the_way`|`delivered`

**Responses**

- `200 OK`: Status updated
- `400 Bad request`: Invalid `status` or `status` not provided
- `401 Unauthorized`: Not logged in
- `403 Forbidden`
	- Delivery agent only route
	- Delivery not acquired by the current delivery agent
- `404 Not found`: Order not found

#### `GET` `/orders/:orderId/delivery/agent` Get delivery agent information

- `200 OK`: [`PartialUserSchema`](#partialuserschema)
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Attempting to get information of another user's delivery
- `404 Not found`: Order not found

#### `POST` `/orders/:orderId/delivery/agent/reviews` Add review to delivery agent

**Request body**

- `rating`: `Number`. Rating out of 5.0
- `review`

**Responses**

- `200 OK`: Review added. Returns `reviewId`
- `400 Bad request`: Invalid inputs for the request
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Attempting to post review for another user's delivery
- `404 Not found`
	- Order not found
	- No agent for the order

### Sales

#### `GET` `/sales/:item` Get sales for an item

**Query parameters**

- `date_from`: Optional
- `date_to`: Optional
- `metric`: `expenses`|`sales`|`revenue`|`expected_sales`
- `period`: `daily`|`weekly`|`monthly`. Defaults to `weekly`
	- Custom periods can be passed as in the following examples
		- `7d`
		- `3m`
		- `1y`

**Response body**

- `200 OK`
	- `data`: `Number[]`
	- `date_from`: Since when
	- `date_to`
- `400 Bad request`: Invalid values for query parameters
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Admin only route
- `404 Not found`: Item not found

#### `GET` `/sales/:item/:month` Get sales for an item for a month

**Query parameters**

- `metric`: `expenses`|`sales`|`revenue`|`expected_sales`

**Response body**

- `200 OK`
	- `data`: `Number[]`
	- `date_from`: Since when
	- `date_to`
- `400 Bad request`: Invalid values for query parameters
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Admin only route
- `404 Not found`
	- Item not found
	- No data for the month

#### `GET` `/sales/compare` Compare items' performances

**Query parameters**

- `items`: Comma-separated list of items
- `date_from`: Optional
- `date_to`: Optional
- `metric`: `expenses`|`sales`|`revenue`|`expected_sales`
- `reduce_function`: Reduce all the values related to the item to one value with the given function. Could be one of
	- `sum`
	- `avg`
- `period`: `daily`|`weekly`|`monthly`. Defaults to `weekly`
	- Custom periods can be passed as in the following examples
		- `7d`
		- `3m`
		- `1y`

**Responses**

- `200 OK`
	- `data`: `({ ItemName: Number[] })[]`
	- `reduced_data`: `({ ItemName: Number })[]`
	- `date_from`: Since when
	- `date_to`
- `400 Bad request`: Invalid values for query parameters
- `401 Unauthorized`: Not logged in
- `403 Forbidedn`: Admin only route
- `404 Not found`
	- Item not found


#### `GET` `/sales/monthly` Get monthly sales breakdown

**Query parameters**

- `itemName`: Optional. Returns the sales breakdown of the item if provided. Returns sales breakdown of all items if absent.

**Responses**

- `200 OK`
	- List of
		- `month`
		- `expected_sales`
		- `costs`
		- `revenue`
		- `profit`
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Admin only route
- `404 Not found`: Item not found

#### `GET` `/sales/supplyMetrics` Get supply metrics

**Query parameteres**

- `itemName`: Search an item according to the query

**Responses**

- `200 OK`
	- List of
		- `order_id`
		- `item`
		- `ordered_quantity`
		- `estimated_cost`
		- `estimated_selling_price`
		- `estimated_profit`
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Admin only route

#### `POST` `/sales/expenses/:month` Add a new expense for the month

**Request body**

- `type`
- `expense_amount`

**Responses**

- `200 OK`: Expense added
- `400 Bad request`: Invalid inputs for the request
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Admin only route

#### `DELETE` `/sales/expenses/:month/:expense` Delete the expense

**Responses**

- `200 OK`: Expense removed
- `401 Unauthorized`: Not logged in
- `403 Forbidden`: Admin only route
- `404 Not found`: Expense not found for month

### Forums

#### `GET` `/forums` List all forum threads

**Query parameters**
- `type`: Thread type (Inquiry, Suggestion, Tips, Discussion)

**Respones**

- `200 OK` Listing successful
	- List of `threads`:
		- `title`
		- `replyCount`: Number of replies on the thread
		- `createdDate`: Thread creation date
		- `edittedDate`: Last editted date
		- `category`: Thread category (inquiry, suggestion, tips)
		- `createdUser`: [`PartialUserSchema`](#partialuserschema)

#### `POST` `/forums` Create a new thread

**Request body**

- **`title`**: Thread title
- **`content`**: Thread's content
- **`type`**: Thread's type

**Responses**

- `201 Created` Thread created
- `400 Bad request` Invalid inputs for the request
- `401 Unauthorized` Not logged in

#### `GET` `/forums/:thread` Get forum thread

**Responses**

- `200 OK` Successful
	- `title`: Thread's title
	- `content`: Thread's content
	- `createdDate`: Thread creation date
	- `edittedDate`: Last editted date
	- `category`: Thread category (inquiry, suggestion, tips)
	- `createdUser`: [`PartialUserSchema`](#partialuserschema)
	- List of `replies`:
		- `user`: [`PartialUserSchema`](#partialuserschema)
		- `postedDate`
		- `content`

- `404 Not found` Thread not found

#### `PUT` `/forums/:thread` Edit forum thread

Same as [`POST` `/forums` Create a new thread](#post-forums-create-a-new-thread)

**Respones**

- `401 Unauthorized`: Not logged in
- `403 Forbidden` When attempting to modify a thread which is not owned by the user

#### `DELETE` `/forums/:thread` Delete forum thread

**Responses**

- `200 OK` Delete successful
- `401 Unauthorized`: Not logged in
- `403 Forbidden` When attempting to delete a thread which is not owned by the user
- `404 Not found` Thread not found

#### `POST` `/forums/:thread/replies` Post a reply to a thread

**Request body**
- `content`: Reply content

**Responses**
- `200 OK` Reply posted
- `400 Bad request` Invalid inputs for the request
- `401 Unauthorized` Not logged in
- `404 Not found` Thread not found


### Tickets

#### `GET` `/tickets` List all tickets

**Query parameters**
- `status`: `open`|`closed`. List from any type if `status` is not provided.

**Responses**
- `200 OK` Listing successful
	- List of `tickets`: [`TicketSchema[]`](#ticketschema)
- `401 Unauthorized`: Not logged in		
- `403 Forbidden`: User attempting to list another user's ticket. Support agents can bypass this.


#### `POST` `/tickets` Create a new ticket

**Request body**

- `type`: Ticket type (inquiry, complaint, etc.)
- `title`
- `content`

**Responses**

- `201 Created`: Ticket creation successful
- `400 Bad request`: Invalid inputs for the request
- `401 Unauthorized`: Not logged in		
- `403 Forbidden`: User attempting to list another user's ticket. Support agents can bypass this.

#### `GET` `/tickets/:ticketId` Get ticket

**Respones**

- `200 OK`: Successful. Returns [`TicketSchema`](#ticketschema)

#### `PUT` `/tickets/:ticketId` Edit ticket

Same as [`POST` `/tickets` Create a new ticket](#post-tickets-create-a-new-ticket)

**Responses**

- `401 Unauthorized`: Not logged in		
- `403 Forbidden`: If trying to edit a ticket that is not owned by self (Support agents can bypass this)

#### `PATCH` `/tickets/:ticketId` Set resolved status

**Request body**

- `resolved`: `true`|`false`

**Responses**

- `200 OK`: Resolving successful
- `400 Bad request`: Invalid inputs for the request
- `401 Unauthorized`: Not logged in		
- `403 Forbidden`: Only support agents can resolve tickets.
- `404 Not found`: Ticket not found

#### `DELETE` `/tickets/:ticketId` Delete ticket

**Responses**

- `200 OK`: Delete successful
- `401 Unauthorized`: Not logged in		
- `403 Forbidden`: Trying to delete a ticket that is not owned by self. Support agents can bypass this
- `404 Not found`: Ticket not found

