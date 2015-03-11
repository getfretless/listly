var Listly = function() {

  function Listly() {
    var self = this;
    self.tasks = [];

    function addTask(task_name) {
      // All of this...
      // var properties = {};
      // properties.name = task_name;
      // var task = new Task(properties);
      // self.tasks.push(task);

      // Is equivalent to these two line
      var task = new Task({ name: task_name });
      self.tasks.push(task);

      if (save()) {
        appendToList(task);
        return true;
      }
      else {
        return false;
      }
    }

    function appendToList(task) {
      // Grab a copy of the list item template.
      var li = $('#list_item_template').clone();
      li.removeAttr('id');

      li.addClass('task');
      li.attr('data-task-id', task.id);
      li.find('label').text(task.name);

      // Unhide the new LI.
      li.removeClass('hidden');

      // Activate the delete button.
      li.find('button.delete').click(function() {
        self.tasks.splice(self.tasks.indexOf(task), 1);
        save();
        li.remove();
      });

      // Activate the edit button.
      li.find('button.edit').click(task, createEditForm);

      // Sets up the event handler on all button.edit elements,
      // including those that are not yet on the page.
      // $('body').on('click', 'button.edit', function() { });

      $('#tasks').append(li);
    }

    function createEditForm(ev) {
      var task, li, edit_form, name_field, label;
      task = ev.data;
      li = $(this).closest('li');
      label = li.find('label');

      edit_form = $('#edit_form_template').clone().removeAttr('id');
      edit_form.removeClass('hidden');
      name_field = edit_form.find('.edit-task-name');
      name_field.attr('data-task-id', task.id).val(task.name);


      li.find('.btn-group').addClass('hidden');
      label.addClass('hidden');
      edit_form.insertBefore(label);
      name_field.focus().select();

      // Save and Cancel handlers
      edit_form.submit(updateTask);
      edit_form.find('button.cancel').click(function(ev) {
        removeEditForm(edit_form);
      });
    }

    function updateTask(ev) {
      ev.preventDefault();
      var field, id, task;
      field = $(this.elements.task_name);
      id = field.data('task-id');

      task = getTaskById(id);
      task.name = field.val();

      if (save()) {
        $(this).siblings('label').text(field.val());
        removeEditForm(this);
      }
    }

    function getTaskById(id) {
      var task;
      $.each(self.tasks, function(index, current_task) {
        if (current_task.id == id) {
          task = current_task;
          return false;
        }
      });
      return task;
    }

    function removeEditForm(form) {
      var label, field;
      form = $(form);
      label = form.siblings('label');
      field = form.find('.edit-task-name');

      label.removeClass('hidden');
      form.siblings('.btn-group').removeClass('hidden');
      form.remove();
    }

    function showFormError(form) {
      // add message inside alert div
      $(form).find('.alert').removeClass('hidden');
    }

    function supportsLocalStorage() {
      try {
         return 'localStorage' in window && window.localStorage !== null;
      }
      catch(err) {
        return false;
      }
    }

    function load() {
      var task_objects, task;
      if (supportsLocalStorage() && localStorage.tasks) {
        task_objects = JSON.parse(localStorage.tasks);

        task_objects.sort(function(a, b) {
          if (isNaN(a.position) || isNaN(b.position)) {
            return 0;
          }
          return a.position - b.position;
        });

        $.each(task_objects, function(index, task_properties) {
          task = new Task(task_properties);
          self.tasks.push(task);
          appendToList(task);
        });
      }
    }

    function updatePositions() {
      var task_id, task;
      $('#tasks li.task').each(function(index) {
        task_id = $(this).data('task-id');
        task = getTaskById(task_id);
        if (task) {
          task.position = index + 1;
        }
      });
    }

    function save() {
      if (supportsLocalStorage()) {
        updatePositions();
        return (localStorage.tasks = JSON.stringify(self.tasks));
      }
      else {
        return false;
      }
    }

    load();

    $('form#new_task').on('submit', function(ev) {
      ev.preventDefault();
      var field = $(this.task_name);
      var task_name = field.val();

      if (addTask(task_name)) {
        field.val('');
      }
      else {
        showFormError(this);
      }
      field.focus().select();
    });

    $('#tasks').sortable({
      update: save
    });
  }

  return Listly;
}();

var listly = new Listly();
