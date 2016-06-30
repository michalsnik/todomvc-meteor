import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({}, { sort: { createdAt: -1 } });
  });
}

Meteor.methods({
  'tasks.insert'(text) {
    Tasks.insert({
      text,
      createdAt: new Date(),
    });
  },
  'tasks.remove'(taskId) {
    Tasks.remove(taskId);
  },
  'tasks.setCompleted'(taskId, setCompleted) {
    Tasks.update(taskId, { $set: { completed: setCompleted } });
  },
  'tasks.clearCompleted'() {
    Tasks.remove({ completed: true });
  },
});
