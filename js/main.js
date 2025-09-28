require.config({
  paths: {
    jquery: "https://code.jquery.com/jquery-3.7.1.min",
    moment:
      "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.4/moment.min",
  },
});

require([
  "jquery",
  "moment",
  "app/tasks",
  "app/popup",
  "app/toggle",
  "app/events",
], function ($, moment, tasks, popup, toggle, events) {
  $(document).ready(function () {
    toggle.init();
    tasks.init();
    events.init();
    popup.init();
  });
});
