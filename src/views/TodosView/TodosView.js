import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { actions as todosActions } from '../../redux/modules/todos';
import TodoItem from './../../components/TodoItem';
import _debug from 'debug';

const debug = _debug('app:views:TodosView');
// const classes = {};
// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  todos: state.todos.items,
  isLoaded: state.todos.isLoaded
});

export class TodosView extends Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    list: PropTypes.func.isRequired
  };

  static reduxAsyncConnect(params, store) {
    const {dispatch, getState} = store;
    const promises = [];
    if (!getState().todos.isLoaded) {
      let dispatchRes = dispatch(todosActions.list());
      debug('dispatchRes', dispatchRes);
      promises.push(dispatchRes);
    }
    return Promise.all(promises);
  }

  render() {
    return (
      <div className='container text-center'>
        <ul className='todo-list'>
          {this.props.todos.map(todo =>
            <TodoItem key={todo.id} todo={todo} />
          )}
        </ul>
        {this.props.todos.length}
      </div>
    );
  }
};

export default connect(mapStateToProps, todosActions)(TodosView);
