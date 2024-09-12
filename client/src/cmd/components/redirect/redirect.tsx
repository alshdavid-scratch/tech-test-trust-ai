import { route } from 'preact-router';
import { Component } from "preact";

export type RedirectProps = {
  to: string
}

export class Redirect extends Component<RedirectProps, {}> {
  componentWillMount() {
    setTimeout(() => route(this.props.to, true), 0);
  }

  render() {
    return null;
  }
}
