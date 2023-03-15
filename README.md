<!-- Project Shields -->


### Built With:

<div align="center">

![Javascript][javascript]
![Node.js][node]
![Express.js][express]
![Socket.io][Socket.io]
![CSS3][CSS3]
![HTML5][HTML5]

</div>


<div>
  <p align="center">
    <a href="https://github.com/astrokachi/Restaurant-chatbot#readme"><strong>Docs »</strong></a>
    <br />
    <br />
    <a href="https://https://chat-bot-mj15.onrender.com/">Demo</a>
    ·
    <a href="https://github.com/astrokachi/Restaurant-chatbot/issues">Report Bug</a>
    ·
    <a href="https://github.com/astrokachi/Restaurant-chatbot/issues">Request Feature</a>
  </p>
</div>

# RESTAURANT CHATBOT 



<summary> <strong>Requirements</strong> </summary>

- [x] ChatBot interface would be like a chat interface
 
- [x] No need for authentication but we should be able to store user session based on devices
 
- [x] When a customer lands on the chatbot page, the bot should send these options to the customer:
 - [x] Select 1 to Place an order
 - [x] Select 99 to checkout order
 - [x] Select 98 to see order history
 - [x] Select 97 to see current order
 - [x] Select 0 to cancel order

- [x] When a customer selects “1”, the bot should return a list of items from the restaurant. It is up to you to create the items in your restaurant for the customer. The order items can have multiple options but the customer should be able to select the preferred items from the list using this same number select system and place an order.

### A fully functional chatbot written in javascript designed to take your orders, respond and store them 


An interface is designed in a user friendly chat style for users choose from a list of commands and get response accordingly. The menu is as listed below:
 
* Place an order (1):
   A list of food items currently available is displayed to the user to select from. After selecting a food item, the main menu is returned back as well as a confirmation that the last order was received. A user may then decide to choose another item if he/she wishes to.

* Checkout an order (99): 
   When a user enters this option the food(s) selected from the above is confirmed for checkout. A confirmation is sent back to the user that the process was successful and the items checked out are stored in the user checkout history database. The main menu is also returned in case the user wants to perform any more operations.

* See order history (98): 
   When selected, a list of all checked out orders is returned and displayed to the user. This does not include orders that have not been checked out.
   

* See current order (97):
   While placing orders, they are stored temporarily so that users can see their current orders. This option returns the current order that hasn't been checkedout yet.

* Cancel order (0):
   This option clears the current order memory thereby removing all orders that haven't been checked out.




<!-- Back to Top Navigation Anchor -->

<a name="readme-top"></a>



</details>

<br>

## Development

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Socket.io](https://socket.io/docs/v4/)

#### Clone this repo

```sh
git clone https://github.com/astrokachi/Restaurant-chatbot.git
```

#### Install project dependencies

```sh
npm install
```

or

```sh
yarn install
```

#### Update .env with [example.env](/example.env)

#### Run a development server

```sh
npm run start:dev
```

or

```sh
yarn run start:dev
```
## Usage

- Link to chatbot
https://chat-bot-mj15.onrender.com/


<!-- License -->

## License

Distributed under the MIT License. See <a href="/LICENSE.md">LICENSE</a> for more information.

<p align="right"><a href="#readme-top">back to top</a></p>

---

<!-- Contact -->

## Contact

- Twitter - [@kachi_oz](https://twitter.com/kachi_oz)
- email - [astrokachi@gmail.com]


<p align="right"><a href="#readme-top">back to top</a></p>


