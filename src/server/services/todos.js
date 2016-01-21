/**
 * fetcher todos service
 */
import _ from 'lodash';
import uuid from 'node-uuid';
const todos = [];

function createCounter() {
  return {
    id: uuid.v4(),
    value: 0
  };
}

export default {
  name: 'todos',
  read(req, resource, {id, limit, max_id}, config, done) {
    if (!id) {
      return done(null, {
        data: todos
      });
    }
    let counter = _.find(todos, {
      id: id
    });
    if (!counter) {
      return done(null, {
        data: []
      });
    }
    return done(null, {
      data: [counter]
    });
  },
  create(req, resource, params, body, config, done) {
    let counter = createCounter();
    todos.push(counter);
    return done(null, {
      data: [counter]
    });
  },
  update(req, resource, {id}, body, config, done) {
    let counter = _.find(todos, {id: id});
    if (!counter) {
      return done(new Error('unable to find counter by id'));
    }
    if (body && body.value) {
      counter.value = body.value;
    }
    return done(null, {
      data: [counter]
    });
  },
  delete(req, resource, {id}, config, done) {
    let removed = _.remove(todos, {id: id});
    if (removed.length === 0) {
      return done(new Error('unable to find counter by id'));
    }
    return done(null, {
      data: []
    });
  }
};