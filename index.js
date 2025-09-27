$(document).ready(function () {
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
    $("#arrowWebsite").toggle();
    $("#arrowDevelopment").toggle();
    $("#arrowProduckDesign").toggle();
  });

  $("#arrowTerselesaikan").click(function () {
    const $img = $(this);
    if ($img.attr("src") === "/assets/Arrow - Right 2.png") {
      $img.attr("src", "/assets/arrowUp.png");
      $img.addClass("w-6 h-6");
    } else {
      $img.attr("src", "/assets/Arrow - Right 2.png");
    }
    $("#contentTerselesaikan").slideToggle();
  });

  $("#arrowProduckDesign").click(function () {
    if ($(this).attr("src") === "/assets/Arrow - Down 2.svg") {
      $(this).attr("src", "/assets/arrowUp.png");
      $(this).addClass("w-6 h-6");
    } else {
      $(this).attr("src", "/assets/Arrow - Down 2.svg");
    }
    $("#containerSubtask").toggle();
    $("#option").toggle();
  });

  $("#option").hover(function () {
    $("#optionText").toggle();
  });

  $("#option").click(function () {
    $("#popUp").toggle();
  });

  $("input[id^='check-point-subtask']").change(function () {
    $(`label[for='${this.id}']`).toggleClass(
      "line-through text-[##293038]",
      this.checked
    );
  });
});
