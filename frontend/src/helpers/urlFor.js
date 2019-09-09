//act as an env file
const urlFor = (endpoint) => {
 return `https://chatingbunny.herokuapp.com/api/chat/${endpoint}`;
};

export default urlFor;