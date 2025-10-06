define(["jquery"], function ($) {
  function init() {
    // Toggle form tambah tugas
    $("#btnTambahTugas").click(function () {
      $("#formTambahTugas").slideToggle(300);
    });

    // Toggle sort menu
    $("#btnByTanggal").click(function () {
      $("#sortByTanggal").slideToggle(200);
    });

    // Toggle section terselesaikan
    $("#btnTerselesaikan").click(function () {
      const $img = $("#arrowTerselesaikan");

      // Toggle arrow image
      if ($img.attr("src") === "/assets/Arrow - Right 2.png") {
        $img.attr("src", "/assets/arrowUp.png");
      } else {
        $img.attr("src", "/assets/Arrow - Right 2.png");
      }

      $("#contentTerselesaikan").slideToggle(300);
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

      $subtask.slideToggle(300);
    });

    $(document).click(function (e) {
      if (
        !$(e.target).closest("#btnByTanggal").length &&
        !$(e.target).closest("#sortByTanggal").length
      ) {
        $("#sortByTanggal").hide();
      }
    });
  }

  return { init };
});
