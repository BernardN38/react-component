import React, { Component } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10
  };

  constructor(props) {
    super(props);
    this.state = {
      jokes: []
    };

    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.resetVotes = this.resetVotes.bind(this);
    this.toggleLock = this.toggleLock.bind(this);
    this.vote = this.vote.bind(this);
  }
  async getJokes() {
    try {
      // load jokes one at a time, adding not-yet-seen jokes
      let jokes = this.state.jokes;

      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...joke } = res.data;
        jokes.push({ ...joke, votes: 0 });
      }
      this.setState({ jokes });
      console.log(jokes)
    } catch (e) {
      console.log(e);
    }
  }
  componentDidMount() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
  }

  generateNewJokes() {
    this.setState(st => ({ jokes: st.jokes.filter(j => j.locked)}));
  }
  resetVotes() {
    this.setState(st => ({
      jokes: st.jokes.map(joke => ({ ...joke, votes: 0 }))
    }));
  }
  toggleLock(id) {
    this.setState(st => ({
      jokes: st.jokes.map(j => (j.id === id ? { ...j, locked: !j.locked } : j))
    }));
  }
  vote(id, delta) {
    this.setState(st => ({
      jokes: st.jokes.map(j =>
        j.id === id ? { ...j, votes: j.votes + delta } : j
      )
    }));
  }
 
  render() {
    return (
      <div className="JokeList">
        {this.state.jokes.map((joke)=>{
          return (
          <Joke
          text={joke.joke}
          key={joke.id}
          id={joke.id}
          votes={joke.votes}
            vote={this.vote}
        />)
        })}
      </div>
    );
  }
}

export default JokeList;
