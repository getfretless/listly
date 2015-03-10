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

      // Add the task name to the LI's label.
      li.find('label').text(task.name);

      // Unhide the new LI.
      li.removeClass('hidden');

      // Activate the delete button.
      li.find('.btn-danger').click(function() {
        // Remove it from the array
        self.tasks.splice(self.tasks.indexOf(task), 1);

        save();

        // Remove it from the <ol>.
        li.remove();
      });

      $('#tasks').append(li);
    }

    function showFormError(form) {
      // add message inside alert div
      $(form).find('.alert')
        .html('Aww, <em>cuss</em>! Something went wrong')
        .removeClass('hidden');
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
      if (supportsLocalStorage() && localStorage.tasks) {
        self.tasks = JSON.parse(localStorage.tasks);
        $.each(self.tasks, function(index, task) {
          appendToList(task);
        });
      }
    }

    function save() {
      if (supportsLocalStorage()) {
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
  }

  return Listly;
}();

var listly = new Listly();
