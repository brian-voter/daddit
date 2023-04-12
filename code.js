const NUM_JOKES_TO_DISPLAY = 10;
const API_ENDPOINT = "https://icanhazdadjoke.com/search";

const $jokesContainer = $("#jokesContainer");

let jokes = [];

class Joke {
  constructor(text, score) {
    this.text = text;
    this.score = score;
    this.scoreLabel = null;
    this.onUpvote = this.onUpvote.bind(this);
    this.onDownvote = this.onDownvote.bind(this);
  }

  onUpvote() {
    this.score++;
    this.scoreLabel.text(this.score);
    renderJokes();
  }

  onDownvote() {
    this.score--;
    this.scoreLabel.text(this.score);
    renderJokes();
  }

  /**
   * Builds an HTML div containing the score, upvote & downvote buttons, and the joke text.
   * @returns jQuery object for the div
   */
  buildHTML() {
    const $jokeDiv = $("<div>");

    this.scoreLabel = $(`<p class="scoreLabel">${this.score}</p>`);
    $jokeDiv.append(this.scoreLabel);

    const upvoteButton = $(`<button class="voteButton">↑</button>`);
    upvoteButton.on("click", this.onUpvote);
    $jokeDiv.append(upvoteButton);

    const downvoteButton = $(`<button class="voteButton">↓</button>`);
    downvoteButton.on("click", this.onDownvote);
    $jokeDiv.append(downvoteButton);

    $jokeDiv.append(`<p class="jokeText">${this.text}</p>`);

    return $jokeDiv;
  }
}

/**
 * Renders the jokes in {@link jokes} according to descending score, adding
 * each to the container div.
 */
function renderJokes() {
  $jokesContainer.empty();
  jokes.sort((j1, j2) => j2.score - j1.score);
  for (const joke of jokes) {
    $jokesContainer.append(joke.buildHTML());
  }
}

/**
 * Returns an array of Joke objects pulled from icanhazdadjoke.com
 * @param {number} numJokes how many jokes to return, between 1 and 30
 * @param {number} page which page to return (use this to randomize), between 1 and (307 / {@link numJokes})
 * @returns {Joke[]}
 */
async function getJokes(numJokes, page) {
  const response = await axios({
    method: 'get',
    url: API_ENDPOINT,
    headers: {
      Accept: "application/json",
    },
    params: {
      term: "",
      limit: numJokes,
      page: page
    }
  });
  return response.data.results.map((result) => new Joke(result.joke, 0));
}

/**
 * Adds jokes from icanhazdadjoke.com to the page.
 * @param {number} numJokes the number of jokes to display
 */
async function addJokes(numJokes) {
  const randPage = Math.floor(Math.random() * 15) + 1;
  jokes = await getJokes(numJokes, randPage);
  renderJokes();
}

addJokes(NUM_JOKES_TO_DISPLAY);