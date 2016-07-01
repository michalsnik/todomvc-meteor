import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { $ } from 'meteor/jquery';

import './task.html';

Template.task.onCreated(function taskOnCreated() {
  this.state = new ReactiveDict();

  this.startEdit = () => {
    this.state.set('isEditing', true);
    Tracker.flush();
    this.$('.js-edit-input').focus();
  };

  this.cancelEdit = () => {
    this.state.set('isEditing', false);
  };

  this.updateTask = (text) => {
    this.state.set('isEditing', false);
    Meteor.call('tasks.update', this.data._id, text);
  };
});

Template.task.helpers({
  isEditing() {
    const instance = Template.instance();
    return instance.state.get('isEditing');
  },
})

Template.task.events({
  'click .js-toggle-completed'() {
    Meteor.call('tasks.setCompleted', this._id, !this.completed);
  },

  'dblclick .js-toggle-edit'(event, instance) {
    instance.startEdit();
  },

  'blur .js-edit-input'(event, instance) {
    instance.updateTask(event.target.value);
  },

  'keyup .js-edit-input'(event, instance) {
    const { keyCode, target: { value } } = event;

    if (keyCode === 13) {
      instance.updateTask(value);
    } else if (keyCode === 27) {
      instance.cancelEdit();
    }
  },

  'click .js-delete'() {
    Meteor.call('tasks.remove', this._id);
  },
});
