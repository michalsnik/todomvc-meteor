import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';

import './task.html';

Template.task.onCreated(function taskOnCreated() {
  this.state = new ReactiveDict();

  this.completeTask = () => {
    Meteor.call('tasks.setCompleted', this.data._id, !this.data.completed);
  };

  this.updateTask = (text) => {
    this.state.set('isEditing', false);
    Meteor.call('tasks.update', this.data._id, text);
  };

  this.removeTask = () => {
    Meteor.call('tasks.remove', this.data._id);
  };

  this.startEdit = () => {
    this.state.set('isEditing', true);
    Tracker.flush();
    this.$('.js-edit-input').focus();
  };

  this.cancelEdit = () => {
    this.state.set('isEditing', false);
    this.$('.js-edit-input').val(this.data.text);
  };
});

Template.task.helpers({
  isEditing() {
    const instance = Template.instance();
    return instance.state.get('isEditing');
  },
});

Template.task.events({
  'click .js-toggle-completed'(event, templateInstance) {
    templateInstance.completeTask();
  },

  'dblclick .js-toggle-edit'(event, templateInstance) {
    templateInstance.startEdit();
  },

  'blur .js-edit-input'(event, templateInstance) {
    templateInstance.updateTask(event.target.value);
  },

  'keyup .js-edit-input'(event, templateInstance) {
    const { keyCode, target: { value } } = event;

    if (keyCode === 13) {
      templateInstance.updateTask(value);
    } else if (keyCode === 27) {
      templateInstance.cancelEdit();
    }
  },

  'click .js-delete'(event, templateInstance) {
    templateInstance.removeTask();
  },
});
