define(["jquery"], function ($) {
  function init() {
    $("#createTask").hide();
    $("#sortByTanggal").hide();
    $("#arrowWebsite").show();
    $("#arrowDevelopment").show();
    $("#arrowProduckDesign").show();
    $("#contentTerselesaikan").hide();
    $("#containerSubtask").hide();
    $("#option").hide();
    $("#optionText").hide();
    $("#popUp").hide();

    $("#btnTambahTugas").click(function () {
      $("#createTask").toggle();
    });

    $("#btnByTanggal").click(function () {
      $("#sortByTanggal").toggle();
    });

    $("#arrowTerselesaikan").click(function () {
      const $img = $(this);
      if ($img.attr("src") === "/assets/Arrow - Right 2.png") {
        $img.attr("src", "/assets/arrowUp.png").addClass("w-6 h-6");
      } else {
        $img.attr("src", "/assets/Arrow - Right 2.png");
      }
      $("#contentTerselesaikan").slideToggle();
    });

    $(document).on("click", "[id^='arrow-']", function (e) {
      e.preventDefault();
      e.stopPropagation();

      let index = this.id.split("-")[1];
      let $img = $(this);
      let $subtask = $(`#subtask-${index}`);

      if ($img.attr("src") === "/assets/Arrow - Down 2.svg") {
        $img.attr("src", "/assets/arrowUp.png");
      } else {
        $img.attr("src", "/assets/Arrow - Down 2.svg");
      }

      $subtask.slideToggle();
    });
  }

  return { init };
});
