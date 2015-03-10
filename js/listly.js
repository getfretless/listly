var Listly = function() {

  function Listly() {
    var self = this;
    self.tasks = [];

    function addTask(task_name) {
      self.tasks.push(task_name);
      if (save()) {
        appendToList(task_name);
        return true;
      }
      else {
        return false;
      }
    }

    function appendToList(task_name) {
      // Grab a copy of the list item template.
      var li = $('#list_item_template').clone();
      li.removeAttr('id');

      // Add the task name to the LI's label.
      li.find('label').text(task_name);

      // Unhide the new LI.
      li.removeClass('hidden');

      // Activate the delete button.
      li.find('.btn-danger').click(function() {
        // Remove it from the array
        self.tasks.splice(self.tasks.indexOf(task_name), 1);

        // The above does the same thing as all of this...
        // $.each(self.tasks, function(index, current_task) {
        //   if (current_task === task_name) {
        //     self.tasks.splice(index, 1);
        //
        //     // Stop looking once we find a match
        //     return false;
        //   }
        // });

        // Save the array to local storage.
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
        $.each(self.tasks, function(index, task_name) {
          appendToList(task_name);
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
