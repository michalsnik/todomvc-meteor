import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';

import './task.html';

Template.task.events({
  'click .js-toggle-completed'() {
    Meteor.call('tasks.setCompleted', this._id, !this.completed);
  },
  'click .js-delete'() {
    Meteor.call('tasks.remove', this._id);
  },
});
