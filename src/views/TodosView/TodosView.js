import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { actions as todosActions } from '../../redux/modules/todos';
import TodoItem from './../../components/TodoItem';

// const classes = {};
// We define mapStateToProps where we'd normally use
// the @connect decorator so the data requirements are clear upfront, but then
// export the decorated component after the main class definition so
// the component can be tested w/ and w/o being connected.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
const mapStateToProps = (state) => ({
  todos: state.todos
});

export class TodosView extends Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
    list: PropTypes.func.isRequired
  };

  static reduxAsyncConnect(params, store) {
    const {dispatch, getState} = store;
    const promises = [];
    promises.push(dispatch(todosActions.list()));
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
